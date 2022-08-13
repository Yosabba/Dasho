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

module.exports = {
  list,
  create: [
    idValidation,
    deliverToAddressValidation,
    mobileNumberValidation,
    create,
  ],
  read: [findOrder, read],
};
