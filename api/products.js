const express = require("express");
const productsRouter = express.Router();
const jwt = require("jsonwebtoken");

const { getAllProducts, createProduct, deleteProduct, updateProduct } = require("../db");

productsRouter.get("/", async (req, res) => {
  console.log("request to products");
  const products = await getAllProducts();

  res.send({
    products,
  });
});

productsRouter.post("/", async (req, res, next) => {
  try{
  const product = await createProduct(req.body);

  res.send({
    product,
  });
} catch (error){
  next(error);
}
});

productsRouter.delete("/", async (req, res, next) => {

  const { id } = req.body

  try{
  const product = await deleteProduct(id);

  res.send({
    product,
  });
} catch (error){
  next(error);
}
});

productsRouter.patch("/", async (req, res, next) => {

  const { id, name, description, price, category, inventory, picture } = req.body

  try{
  const product = await updateProduct( id, name, description, price, category, inventory, picture );

  res.send({
    product,
  });
} catch (error){
  next(error);
}
});


module.exports = productsRouter;
