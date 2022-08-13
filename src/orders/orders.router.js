const router = require("express").Router({ mergeParams: true });
const controller = require("./orders.controller");
const methodDisallowed = require("../errors/methodNotAllowed");

// TODO: Implement the /orders routes needed to make the tests pass

router
  .route("/:orderId")
  // .post(controller.create)
  .get(controller.read)
  // .put(controller.update)
  // .delete(controller.delete)
  .all(methodDisallowed);

router
  .route("/")
  .post(controller.create)
  .get(controller.list)
  .all(methodDisallowed);

module.exports = router;
