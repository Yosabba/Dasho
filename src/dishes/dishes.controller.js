const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass

const list = (req, res) => {
  res.json(dishes);
};

const nameValidation = (req, res, next) => {
  const {
    data: { name = null },
  } = req.body;

  if (name === null || name === "") {
    next({
      status: 400,
      message: "Name is required",
    });
  } else {
    next();
  }
};

const descriptionValidation = (req, res, next) => {
  const {
    data: { description },
  } = req.body;
  if (description == null || description === "") {
    next({
      status: 400,
      message: "Description is required",
    });
  } else {
    next();
  }
};

const priceValidation = (req, res, next) => {
  const {
    data: { price = null },
  } = req.body;

  if (
    price === null ||
    price === "" ||
    price <= 0 ||
    typeof price !== "number"
  ) {
    next({
      status: 400,
      message: "Price is required and must be a number",
    });
  } else {
    next();
  }
};

const imgValidation = (req, res, next) => {
  const {
    data: { image_url = null },
  } = req.body;

  if (image_url === null || image_url === "") {
    next({
      status: 400,
      message: "Image URL is required",
    });
  } else {
    next();
  }
};

const doesExist = (req, res, next) => {
  const { dishId } = req.params;
  const foundDish = dishes.find((dish) => dish.id == dishId);

  if (!foundDish) {
    next({
      status: 404,
      message: "Dish not found",
    });
  }
  res.locals.dish = foundDish;
  next();
};

//CRUD

const create = (req, res) => {
  const data = {
    id: nextId(dishes),
    ...req.body,
  };
  dishes.push(data);
  res.json(data);
};

const read = (req, res) => {
  res.json({ data: res.locals.dish });
};

module.exports = {
  list,
  create: [
    nameValidation,
    descriptionValidation,
    priceValidation,
    imgValidation,
    create,
  ],
  read: [doesExist, read],
};
