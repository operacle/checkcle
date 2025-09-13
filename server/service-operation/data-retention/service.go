package dataretention

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"service-operation/pocketbase"
	"sync"
	"time"
)

// Service handles data retention operations
type Service struct {
	pbClient *pocketbase.PocketBaseClient
}

// NewService creates a new data retention service
func NewService(pbClient *pocketbase.PocketBaseClient) *Service {
	return &Service{
		pbClient: pbClient,
	}
}

// GetDataSettings fetches the current data retention settings
func (s *Service) GetDataSettings() (*DataSettings, error) {
	resp, err := s.pbClient.GetHTTPClient().Get(
		fmt.Sprintf("%s/api/collections/data_settings/records", s.pbClient.GetBaseURL()),
	)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch data settings: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("failed to fetch data settings, status: %d", resp.StatusCode)
	}

	var response DataSettingsResponse
	if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
		return nil, fmt.Errorf("failed to decode data settings response: %w", err)
	}

	if len(response.Items) == 0 {
		return nil, fmt.Errorf("no data settings found")
	}

	return &response.Items[0], nil
}

// CleanupOldRecords performs cleanup of old records based on retention settings
func (s *Service) CleanupOldRecords() (*CleanupSummary, error) {
	startTime := time.Now()
	
	settings, err := s.GetDataSettings()
	if err != nil {
		return nil, fmt.Errorf("failed to get data settings: %w", err)
	}

	// Check if cleanup should run (only once per day)
	if !s.shouldRunCleanup(settings) {
		// log.Println("Skipping cleanup - less than 24 hours since last run")
		return &CleanupSummary{
			StartTime: startTime,
			EndTime:   time.Now(),
			Duration:  0,
			Results:   make([]CleanupResult, 0),
		}, nil
	}

	summary := &CleanupSummary{
		StartTime: startTime,
		Results:   make([]CleanupResult, 0),
	}

	// Define collections and their corresponding retention days
	uptimeCollections := []string{"dns_data", "ping_data", "tcp_data", "uptime_data", "services_metrics"}
	serverCollections := []string{"server_metrics", "docker_metrics"}

	// Process collections in parallel for better performance
	var wg sync.WaitGroup
	resultsChan := make(chan CleanupResult, len(uptimeCollections)+len(serverCollections))

	// Cleanup uptime-related collections in parallel
	if settings.UptimeRetentionDays > 0 {
		cutoffDate := time.Now().AddDate(0, 0, -settings.UptimeRetentionDays)
		// log.Printf("Cleaning uptime collections with %d days retention (cutoff: %s)", 
		//	settings.UptimeRetentionDays, cutoffDate.Format("2006-01-02 15:04:05"))
		for _, collection := range uptimeCollections {
			wg.Add(1)
			go func(col string) {
				defer wg.Done()
				result := s.cleanupCollection(col, cutoffDate)
				resultsChan <- result
			}(collection)
		}
	} else {
		// log.Println("Skipping uptime collections cleanup - retention days is 0")
	}

	// Cleanup server-related collections in parallel
	if settings.ServerRetentionDays > 0 {
		cutoffDate := time.Now().AddDate(0, 0, -settings.ServerRetentionDays)
		// log.Printf("Cleaning server collections with %d days retention (cutoff: %s)", 
		//	settings.ServerRetentionDays, cutoffDate.Format("2006-01-02 15:04:05"))
		for _, collection := range serverCollections {
			wg.Add(1)
			go func(col string) {
				defer wg.Done()
				result := s.cleanupCollection(col, cutoffDate)
				resultsChan <- result
			}(collection)
		}
	} else {
		// log.Println("Skipping server collections cleanup - retention days is 0")
	}

	// Wait for all collections to complete and collect results
	go func() {
		wg.Wait()
		close(resultsChan)
	}()

	// Collect all results
	for result := range resultsChan {
		summary.Results = append(summary.Results, result)
		summary.TotalDeleted += result.RecordsDeleted
	}

	summary.EndTime = time.Now()
	summary.Duration = summary.EndTime.Sub(summary.StartTime)

	// Update last cleanup time after successful completion
	if err := s.updateLastCleanupTime(); err != nil {
		// log.Printf("Warning: Failed to update last cleanup time: %v", err)
	}

	// log.Printf("Data retention cleanup completed. Total records deleted: %d, Duration: %v", 
	//	summary.TotalDeleted, summary.Duration)

	return summary, nil
}

// cleanupCollection deletes records older than the cutoff date from a specific collection
func (s *Service) cleanupCollection(collection string, cutoffDate time.Time) CleanupResult {
	result := CleanupResult{
		Collection: collection,
	}

	// Format cutoff date for PocketBase filter (RFC3339 format)
	cutoffStr := cutoffDate.UTC().Format("2006-01-02T15:04:05.000Z")
	
	// Get records to delete (balanced batch size for performance vs rate limits)
	batchSize := 50
	totalDeleted := 0

	for {
		// Always fetch page 1 since we're deleting records (pagination shifts after deletes)
		filter := fmt.Sprintf("created < '%s'", cutoffStr)
		encodedFilter := url.QueryEscape(filter)
		requestURL := fmt.Sprintf("%s/api/collections/%s/records?page=1&perPage=%d&filter=%s",
			s.pbClient.GetBaseURL(), collection, batchSize, encodedFilter)

		resp, err := s.pbClient.GetHTTPClient().Get(requestURL)
		if err != nil {
			result.Error = fmt.Sprintf("failed to fetch records: %v", err)
			return result
		}
		defer resp.Body.Close()

		// Check if response is successful
		if resp.StatusCode != http.StatusOK {
			result.Error = fmt.Sprintf("API request failed with status %d for collection %s", resp.StatusCode, collection)
			return result
		}

		var response struct {
			Items []struct {
				ID string `json:"id"`
			} `json:"items"`
			TotalItems int `json:"totalItems"`
		}

		if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
			result.Error = fmt.Sprintf("failed to decode response for collection %s: %v", collection, err)
			return result
		}

		if len(response.Items) == 0 {
			// log.Printf("No more old records found in collection %s", collection)
			break // No more records to delete
		}

		// log.Printf("Found %d old records in collection %s (batch), total items in DB: %d", 
		//	len(response.Items), collection, response.TotalItems)

		// Delete records with conservative rate limiting to avoid 429 errors
		semaphore := make(chan struct{}, 3) // Further reduced to 3 concurrent deletes
		var deleteWg sync.WaitGroup
		var mu sync.Mutex
		batchDeleted := 0
		rateLimitHit := false

		for _, record := range response.Items {
			deleteWg.Add(1)
			go func(recordID string) {
				defer deleteWg.Done()
				semaphore <- struct{}{} // Acquire
				defer func() { <-semaphore }() // Release

				deleted := false
				retryCount := 0
				maxRetries := 5
				
				for !deleted && retryCount < maxRetries {
					if err := s.deleteRecord(collection, recordID); err != nil {
						if retryCount < maxRetries-1 {
							// Progressive backoff with longer delays for rate limits
							baseWait := time.Duration(1<<retryCount) * 500 * time.Millisecond
							if retryCount >= 2 {
								// Extra penalty for persistent rate limits
								baseWait += time.Duration(retryCount) * 2 * time.Second
							}
							
							mu.Lock()
							rateLimitHit = true
							mu.Unlock()
							
							time.Sleep(baseWait)
							retryCount++
							continue
						} else {
							// log.Printf("Failed to delete record %s from %s after %d retries: %v", 
							//	recordID, collection, maxRetries, err)
							break
						}
					} else {
						deleted = true
						mu.Lock()
						batchDeleted++
						mu.Unlock()
					}
				}
				
				// Increased delay between deletions with adaptive timing
				mu.Lock()
				currentRateLimitHit := rateLimitHit
				mu.Unlock()
				
				if currentRateLimitHit {
					time.Sleep(150 * time.Millisecond) // Longer delay if rate limits detected
				} else {
					time.Sleep(75 * time.Millisecond)  // Standard delay
				}
			}(record.ID)
		}

		deleteWg.Wait()
		totalDeleted += batchDeleted

		// If we got fewer records than batch size, we're done
		if len(response.Items) < batchSize {
			// log.Printf("Finished processing collection %s - no more old records", collection)
			break
		}
		
		// More conservative delay between batches with adaptive timing
		if len(response.Items) > 0 {
			mu.Lock()
			currentRateLimitHit := rateLimitHit
			mu.Unlock()
			
			baseDelay := 300 * time.Millisecond
			if currentRateLimitHit {
				baseDelay = 1 * time.Second // Much longer delay if rate limits were hit
				// log.Printf("Processed batch for collection %s (%d deleted), rate limits detected - waiting longer before next batch...", collection, batchDeleted)
			} else {
				// log.Printf("Processed batch for collection %s (%d deleted), processing next batch...", collection, batchDeleted)
			}
			
			time.Sleep(baseDelay)
		}
	}

	result.RecordsDeleted = totalDeleted
	
	if totalDeleted > 0 {
		// log.Printf("Deleted %d records from collection %s", totalDeleted, collection)
	}

	return result
}

// deleteRecord deletes a single record from a collection
func (s *Service) deleteRecord(collection, recordID string) error {
	requestURL := fmt.Sprintf("%s/api/collections/%s/records/%s", s.pbClient.GetBaseURL(), collection, recordID)
	
	req, err := http.NewRequest("DELETE", requestURL, nil)
	if err != nil {
		return err
	}

	resp, err := s.pbClient.GetHTTPClient().Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusNoContent && resp.StatusCode != http.StatusOK {
		return fmt.Errorf("failed to delete record, status: %d", resp.StatusCode)
	}

	return nil
}

// ScheduleCleanup runs cleanup based on schedule (can be called periodically)
func (s *Service) ScheduleCleanup() error {
	// log.Println("Starting scheduled data retention cleanup...")
	
	_, err := s.CleanupOldRecords()
	if err != nil {
		// log.Printf("Scheduled cleanup failed: %v", err)
		return err
	}

	// log.Printf("Scheduled cleanup completed successfully. Summary: %+v", summary)
	return nil
}

// shouldRunCleanup checks if cleanup should run based on last cleanup time (once per day)
func (s *Service) shouldRunCleanup(settings *DataSettings) bool {
	if settings.LastCleanup == "" {
		// log.Println("No previous cleanup found, proceeding with cleanup...")
		return true
	}

	lastCleanup, err := time.Parse(time.RFC3339, settings.LastCleanup)
	if err != nil {
		// log.Printf("Failed to parse last cleanup time '%s', proceeding with cleanup: %v", settings.LastCleanup, err)
		return true
	}

	timeSinceLastCleanup := time.Since(lastCleanup)
	minInterval := 24 * time.Hour

	if timeSinceLastCleanup < minInterval {
		// log.Printf("Last cleanup was %v ago (less than 24h), skipping cleanup", timeSinceLastCleanup)
		return false
	}

	// log.Printf("Last cleanup was %v ago, proceeding with cleanup", timeSinceLastCleanup)
	return true
}

// updateLastCleanupTime updates the last cleanup timestamp in data settings
func (s *Service) updateLastCleanupTime() error {
	settings, err := s.GetDataSettings()
	if err != nil {
		return fmt.Errorf("failed to get data settings: %w", err)
	}

	// Update the last cleanup time
	now := time.Now().UTC().Format(time.RFC3339)
	
	// Create the update payload
	updateData := map[string]interface{}{
		"last_cleanup": now,
	}

	jsonData, err := json.Marshal(updateData)
	if err != nil {
		return fmt.Errorf("failed to marshal update data: %w", err)
	}

	// Update the record via PocketBase API
	requestURL := fmt.Sprintf("%s/api/collections/data_settings/records/%s", s.pbClient.GetBaseURL(), settings.ID)
	
	req, err := http.NewRequest("PATCH", requestURL, bytes.NewBuffer(jsonData))
	if err != nil {
		return fmt.Errorf("failed to create update request: %w", err)
	}
	
	req.Header.Set("Content-Type", "application/json")

	resp, err := s.pbClient.GetHTTPClient().Do(req)
	if err != nil {
		return fmt.Errorf("failed to update last cleanup time: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("failed to update last cleanup time, status: %d", resp.StatusCode)
	}

	// log.Printf("Updated last cleanup time to: %s", now)
	return nil
}