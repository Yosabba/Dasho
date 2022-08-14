const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /orders handlers needed to make the tests pass

const list = (req, res) => {
  res.json(orders);
};

const deliverToAddressValidation = (req, res, next) => {
  const {
    data: { deliverTo = null },
  } = req.body;

  if (deliverTo === "" || deliverTo === null) {
    next({
      status: 400,
      message: "Please provide a valid address to deliver to",
    });
  }

  next();
};

const mobileNumberValidation = (req, res, next) => {
  const {
    data: { mobileNumber = null },
  } = req.body;

  if (mobileNumber === "" || mobileNumber === null) {
    next({
      status: 400,
      message: "Please provide a valid mobile number",
    });
  }

  next();
};

const idValidation = (req, res, next) => {
  const {
    data: { id },
  } = req.body;

  if (id === "") {
    next({
      status: 400,
      message: "Please provide a valid id",
    });
  }

  next();
};

const findOrder = (req, res, next) => {
  const { orderId } = req.params;
  const order = orders.find((order) => order.id === orderId);
  if (!order) {
    next({
      status: 404,
      message: "Order not found",
    });
  }
  res.locals.order = order;
  next();
};

const doesIdMatchRoute = (req, res, next) => {
  const { orderId } = req.params;
  const {
    data: { id },
  } = req.body;

  if (!id) {
    next();
  } else if (id && id !== orderId) {
    next({
      status: 400,
      message: `Order id does not match route id. Order: ${id}, Route: ${orderId}.`,
    });
  }
  next();
};

const statusValidation = (req, res, next) => {
  const {
    data: { status },
  } = req.body;

  const newS = res.locals.order.status;

  if (status === "" || status === null) {
    next({
      status: 400,
      message:
        "Order must have a status of pending, preparing, out-for-delivery, delivered",
    });
  } else if (newS === "delivered") {
    next({
      status: 400,
      message: "A delivered order cannot be changed",
    });
  }

  next();
};

//CRUD

const create = (req, res, next) => {
  const data = {
    id: nextId(orders),
    ...req.body.data,
  };

  orders.push(data);
  res.json(data);
};

const read = (req, res, next) => {
  const { order } = res.locals;
  res.json({ data: order });
};

const update = (req, res, next) => {
  const { order } = res.locals;
  const { data } = req.body;

  order.deliverTo = data.deliverTo;
  order.mobileNumber = data.mobileNumber;
  order.status = data.status;
  res.json({ data: order });
};

module.exports = {
  list,
  create: [
    idValidation,
    deliverToAddressValidation,
    mobileNumberValidation,
    create,
  ],
  read: [findOrder, read],
  update: [
    findOrder,
    doesIdMatchRoute,
    idValidation,
    statusValidation,
    deliverToAddressValidation,
    mobileNumberValidation,
    update,
  ],
};
