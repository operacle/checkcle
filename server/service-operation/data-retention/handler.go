package dataretention

import (
	"encoding/json"
	"net/http"
	"service-operation/pocketbase"
)

// Handler handles HTTP requests for data retention operations
type Handler struct {
	service *Service
}

// NewHandler creates a new data retention handler
func NewHandler(pbClient *pocketbase.PocketBaseClient) *Handler {
	return &Handler{
		service: NewService(pbClient),
	}
}

// GetSettings handles GET requests for data retention settings
func (h *Handler) GetSettings(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	settings, err := h.service.GetDataSettings()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(settings)
}

// TriggerCleanup handles POST requests to trigger manual cleanup
func (h *Handler) TriggerCleanup(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	summary, err := h.service.CleanupOldRecords()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(summary)
}

// SetupRoutes sets up the HTTP routes for data retention
func (h *Handler) SetupRoutes(mux *http.ServeMux) {
	mux.HandleFunc("/data-retention/settings", h.GetSettings)
	mux.HandleFunc("/data-retention/cleanup", h.TriggerCleanup)
}