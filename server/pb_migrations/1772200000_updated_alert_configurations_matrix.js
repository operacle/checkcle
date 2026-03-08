/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1938176441")

  // add matrix_homeserver field
  collection.fields.addAt(collection.fields.length, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text_matrix_homeserver",
    "max": 0,
    "min": 0,
    "name": "matrix_homeserver",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add matrix_room_id field
  collection.fields.addAt(collection.fields.length, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text_matrix_room_id",
    "max": 0,
    "min": 0,
    "name": "matrix_room_id",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add matrix_access_token field
  collection.fields.addAt(collection.fields.length, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text_matrix_access_token",
    "max": 0,
    "min": 0,
    "name": "matrix_access_token",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add "matrix" to the notification_type select field values
  const notifTypeField = collection.fields.getByName("notification_type")
  if (notifTypeField && notifTypeField.values) {
    notifTypeField.values.push("matrix")
  }

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1938176441")

  collection.fields.removeById("text_matrix_homeserver")
  collection.fields.removeById("text_matrix_room_id")
  collection.fields.removeById("text_matrix_access_token")

  const notifTypeField = collection.fields.getByName("notification_type")
  if (notifTypeField && notifTypeField.values) {
    notifTypeField.values = notifTypeField.values.filter(v => v !== "matrix")
  }

  return app.save(collection)
})
