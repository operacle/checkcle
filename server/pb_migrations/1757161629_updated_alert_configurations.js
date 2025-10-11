/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1938176441")

  // add field
  collection.fields.addAt(23, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text3401535476",
    "max": 0,
    "min": 0,
    "name": "server_url",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // update field
  collection.fields.addAt(9, new Field({
    "hidden": false,
    "id": "select887233555",
    "maxSelect": 1,
    "name": "notification_type",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "telegram",
      "signal",
      "discord",
      "slack",
      "webhook",
      "google_chat",
      "email",
      "ntfy",
      "pushover",
      "notifiarr",
      "gotify"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1938176441")

  // remove field
  collection.fields.removeById("text3401535476")

  // update field
  collection.fields.addAt(9, new Field({
    "hidden": false,
    "id": "select887233555",
    "maxSelect": 1,
    "name": "notification_type",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "telegram",
      "signal",
      "discord",
      "slack",
      "webhook",
      "google_chat",
      "email",
      "ntfy",
      "pushover",
      "notifiarr"
    ]
  }))

  return app.save(collection)
})
