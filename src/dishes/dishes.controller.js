const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass

const list = (req, res) => {
  res.json(dishes);
};

//CRUD

const create = (req, res) => {
  const newDish = {
    id: nextId(dishes),
    ...req.body,
  };
  dishes.push(newDish);
  res.json({ data: newDish });
};

module.exports = {
  list,
};
