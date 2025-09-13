package dataretention

import "time"

// DataSettings represents the data retention configuration from PocketBase
type DataSettings struct {
	ID                    string `json:"id"`
	CollectionId          string `json:"collectionId"`
	CollectionName        string `json:"collectionName"`
	RetentionDays         int    `json:"retention_days"`
	ServerRetentionDays   int    `json:"server_retention_days"`
	UptimeRetentionDays   int    `json:"uptime_retention_days"`
	LastCleanup           string `json:"last_cleanup"`
	Backup                string `json:"backup"`
	Created               string `json:"created"`
	Updated               string `json:"updated"`
}

// DataSettingsResponse represents the response from PocketBase
type DataSettingsResponse struct {
	Items      []DataSettings `json:"items"`
	Page       int            `json:"page"`
	PerPage    int            `json:"perPage"`
	TotalItems int            `json:"totalItems"`
	TotalPages int            `json:"totalPages"`
}

// CleanupResult represents the result of a cleanup operation
type CleanupResult struct {
	Collection     string `json:"collection"`
	RecordsDeleted int    `json:"records_deleted"`
	Error          string `json:"error,omitempty"`
}

// CleanupSummary represents the overall cleanup summary
type CleanupSummary struct {
	TotalDeleted int             `json:"total_deleted"`
	Results      []CleanupResult `json:"results"`
	StartTime    time.Time       `json:"start_time"`
	EndTime      time.Time       `json:"end_time"`
	Duration     time.Duration   `json:"duration"`
}