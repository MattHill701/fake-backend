const express = require("express");
const ordersRouter = express.Router();
const jwt = require("jsonwebtoken");

const { getAllOrders, createOrder, getOpenOrderById, addProductToOrder, closeOrder } = require("../db");

ordersRouter.get("/", async (req, res) => {
  console.log("request to orders");
  const orders = await getAllOrders();

  res.send({
    orders,
  });
});

ordersRouter.get("/myOrder", async (req, res) => {
  console.log("request to orders");
  const { id } = req.body
  const order = await getOpenOrderById(id);

  res.send({
    order,
  });
});

ordersRouter.post("/", async (req, res, next) => {
  console.log("request to orders");
  const { userId, products, isOpen } = req.body
  try{
  const order = await createOrder(req.body);

  res.send({
    order,
    message: "congrats you did it!"
  });
} catch (error){
  next(error)
}
});

ordersRouter.patch("/", async (req, res, next) => {
  console.log("request to orders");
  const { id, string } = req.body
  try{
  const order = await closeOrder(id, string);
  const order2 = await createOrder({
    userId: id,
    products: "{0}",
    isOpen: true
  });

  res.send({
    order,
    order2,
    message: "congrats you did it!"
  });
} catch (error){
  next(error)
}
});

ordersRouter.patch("/products", async (req, res, next) => {
  console.log("request to orders");
  const { productId, userId } = req.body
  try{
  const order = await addProductToOrder(productId, userId);

  res.send({
    order,
    message: "congrats you did it!"
  });
} catch (error){
  next(error)
}
});


module.exports = ordersRouter;