const router = require("express").Router();
const controller = require("./dishes.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

// TODO: Implement the /dishes routes needed to make the tests pass

router
  .route("/dishes/:dishId")
  // .post(controller.create)
  // .get(controller.read)
  // .put(controller.update)
  // .delete(controller.delete)
  // .all(methodNotAllowed);

router
  .route("/")
  .post(controller.create)
  .get(controller.list)
  // .put(controller.update)
  // .delete(controller.delete)
  // .all(methodNotAllowed);
module.exports = router;
