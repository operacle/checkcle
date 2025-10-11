/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1168766540")

  // update collection data
  unmarshal({
    "deleteRule": ""
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1168766540")

  // update collection data
  unmarshal({
    "deleteRule": "@request.auth.id != \"\""
  }, collection)

  return app.save(collection)
})
