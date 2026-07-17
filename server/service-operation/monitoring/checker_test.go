package monitoring

import (
	"errors"
	"net/http"
	"net/http/httptest"
	"sync/atomic"
	"testing"
	"time"

	"service-operation/pocketbase"
)

func TestNormalizeMaxRetries(t *testing.T) {
	tests := []struct {
		name       string
		configured int
		want       int
	}{
		{"unset falls back to default", 0, defaultMaxRetries},
		{"negative falls back to default", -2, defaultMaxRetries},
		{"single attempt kept as-is", 1, 1},
		{"ui maximum kept as-is", 5, 5},
		{"excessive value clamped to cap", 100, maxRetriesCap},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := normalizeMaxRetries(tt.configured); got != tt.want {
				t.Errorf("normalizeMaxRetries(%d) = %d, want %d", tt.configured, got, tt.want)
			}
		})
	}
}

// flakyServer returns a test server that fails with HTTP 500 for the first
// failures requests and responds 200 afterwards, plus a hit counter.
func flakyServer(failures int64) (*httptest.Server, *int64) {
	var hits int64
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		n := atomic.AddInt64(&hits, 1)
		if n <= failures {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusOK)
	}))
	return server, &hits
}

func TestRunCheckAttemptsRecoversWithinRetryBudget(t *testing.T) {
	server, hits := flakyServer(2)
	defer server.Close()

	service := &pocketbase.Service{
		Name:        "flaky",
		ServiceType: "http",
		URL:         server.URL,
	}

	result, err := runCheckAttempts(service, 3, 5*time.Second, 10*time.Millisecond)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if result == nil || !result.Success {
		t.Fatalf("expected success after retries, got result=%+v", result)
	}
	if got := atomic.LoadInt64(hits); got != 3 {
		t.Errorf("expected 3 attempts, server saw %d", got)
	}
}

func TestRunCheckAttemptsSingleAttemptStaysSingleShot(t *testing.T) {
	server, hits := flakyServer(1)
	defer server.Close()

	service := &pocketbase.Service{
		Name:        "single-shot",
		ServiceType: "http",
		URL:         server.URL,
	}

	result, err := runCheckAttempts(service, 1, 5*time.Second, 10*time.Millisecond)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if result == nil || result.Success {
		t.Fatalf("expected failure with a single attempt, got result=%+v", result)
	}
	if got := atomic.LoadInt64(hits); got != 1 {
		t.Errorf("expected exactly 1 attempt, server saw %d", got)
	}
}

func TestRunCheckAttemptsMarksDownAfterAllAttemptsFail(t *testing.T) {
	server, hits := flakyServer(1000)
	defer server.Close()

	service := &pocketbase.Service{
		Name:        "always-down",
		ServiceType: "http",
		URL:         server.URL,
	}

	result, err := runCheckAttempts(service, 3, 5*time.Second, 10*time.Millisecond)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if result == nil || result.Success {
		t.Fatalf("expected failure after exhausting retries, got result=%+v", result)
	}
	if got := atomic.LoadInt64(hits); got != 3 {
		t.Errorf("expected exactly 3 attempts, server saw %d", got)
	}
}

func TestExecuteCheckUnsupportedServiceType(t *testing.T) {
	service := &pocketbase.Service{
		Name:        "mystery",
		ServiceType: "carrier-pigeon",
	}

	if _, err := executeCheck(service, time.Second); !errors.Is(err, errUnsupportedServiceType) {
		t.Fatalf("expected errUnsupportedServiceType, got %v", err)
	}

	if _, err := runCheckAttempts(service, 3, time.Second, time.Millisecond); !errors.Is(err, errUnsupportedServiceType) {
		t.Fatalf("expected errUnsupportedServiceType from runCheckAttempts, got %v", err)
	}
}
