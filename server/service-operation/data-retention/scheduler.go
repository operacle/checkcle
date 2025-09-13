package dataretention

import (
	"service-operation/pocketbase"
	"time"
)

// Scheduler handles periodic data retention cleanup
type Scheduler struct {
	service  *Service
	interval time.Duration
	stopChan chan bool
}

// NewScheduler creates a new cleanup scheduler
func NewScheduler(pbClient *pocketbase.PocketBaseClient, interval time.Duration) *Scheduler {
	return &Scheduler{
		service:  NewService(pbClient),
		interval: interval,
		stopChan: make(chan bool),
	}
}

// Start begins the periodic cleanup process
func (s *Scheduler) Start() {
	// log.Printf("Starting data retention scheduler with interval: %v", s.interval)
	
	ticker := time.NewTicker(s.interval)
	defer ticker.Stop()

	// Run initial cleanup
	go func() {
		if err := s.service.ScheduleCleanup(); err != nil {
			// log.Printf("Initial cleanup failed: %v", err)
		}
	}()

	for {
		select {
		case <-ticker.C:
			go func() {
				if err := s.service.ScheduleCleanup(); err != nil {
					// log.Printf("Scheduled cleanup failed: %v", err)
				}
			}()
		case <-s.stopChan:
			// log.Println("Data retention scheduler stopped")
			return
		}
	}
}

// Stop stops the scheduler
func (s *Scheduler) Stop() {
	// log.Println("Stopping data retention scheduler...")
	s.stopChan <- true
}

// RunOnce executes cleanup immediately (for manual triggers)
func (s *Scheduler) RunOnce() (*CleanupSummary, error) {
	// log.Println("Running manual data retention cleanup...")
	return s.service.CleanupOldRecords()
}