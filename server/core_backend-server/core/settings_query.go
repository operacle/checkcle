package core

import (
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"os"

	"github.com/pocketbase/pocketbase/tools/security"
	"github.com/pocketbase/pocketbase/tools/types"
)

type Param struct {
	BaseModel

	Created types.DateTime `db:"created" json:"created"`
	Updated types.DateTime `db:"updated" json:"updated"`
	Value   types.JSONRaw  `db:"value" json:"value"`
}

func (m *Param) TableName() string {
	return paramsTable
}

// ReloadSettings initializes and reloads the stored application settings.
//
// If no settings were stored it will persist the current app ones.
func (app *BaseApp) ReloadSettings() error {
	param := &Param{}
	err := app.ModelQuery(param).Model(paramsKeySettings, param)
	if err != nil && !errors.Is(err, sql.ErrNoRows) {
		return err
	}

	// no settings were previously stored -> save
	// (ReloadSettings() will be invoked again by a system hook after successful save)
	if param.Id == "" {
		// force insert in case the param entry was deleted manually after application start
		app.Settings().MarkAsNew()
		return app.Save(app.Settings())
	}

	event := new(SettingsReloadEvent)
	event.App = app

	return app.OnSettingsReload().Trigger(event, func(e *SettingsReloadEvent) error {
		return e.App.Settings().loadParam(e.App, param)
	})
}

// loadParam loads the settings from the stored param into the app ones.
//
// If settings are loaded as plain JSON and an encryption key is configured,
// the settings will be automatically re-saved encrypted for security.
func (s *Settings) loadParam(app App, param *Param) error {
	encryptionKey := os.Getenv(app.EncryptionEnv())

	// try first without decryption
	s.mu.Lock()
	plainDecodeErr := json.Unmarshal(param.Value, s)
	s.mu.Unlock()

	if plainDecodeErr != nil {
		// failed to parse as plain JSON, try to decrypt
		if encryptionKey == "" {
			// load without decryption has failed and there is no encryption key to use for decrypt
			return fmt.Errorf("invalid settings db data or missing encryption key %q", app.EncryptionEnv())
		}

		// decrypt
		decrypted, decryptErr := security.Decrypt(string(param.Value), encryptionKey)
		if decryptErr != nil {
			return decryptErr
		}

		// decode again
		s.mu.Lock()
		decryptedDecodeErr := json.Unmarshal(decrypted, s)
		s.mu.Unlock()
		if decryptedDecodeErr != nil {
			return decryptedDecodeErr
		}
	}

	if err := s.PostScan(); err != nil {
		return err
	}

	return nil
}
