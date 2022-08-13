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

const idValidator = (req, res, next) => {
  const {
    data: { id },
  } = req.body;
  if (id === "") {
    next({
      status: 400,
      message: "ID is required",
    });
  } else {
    next();
  }
};

const doesDishExist = (req, res, next) => {
  const { dishId } = req.params;
  const dish = dishes.find((dish) => dish.id == dishId);

  if (!dish) {
    next({
      status: 404,
      message: `Dish does not exist: ${dishId}.`,
    });
  }
  res.locals.dish = dish;
  next();
};

const doesDishIdMatchRoute = (req, res, next) => {
  const { dishId } = req.params;
  const {
    data: { id },
  } = req.body;

  if (!id){
    next();
  } else if(id && id !== dishId){
    next({
      status: 400,
      message: `Dish ID does not match route: ${dishId}`,
    });
  }
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

const update = (req, res) => {
  const { data } = req.body;
  const dish = res.locals.dish;

  dish.name = data.name;
  dish.description = data.description;
  dish.price = data.price;
  dish.image_url = data.image_url;
  res.json({ data: dish });
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
  read: [doesDishExist, read],
  update: [
    nameValidation,
    descriptionValidation,
    priceValidation,
    imgValidation,
    idValidator,
    doesDishExist,
    doesDishIdMatchRoute,
    update,
  ],
};
