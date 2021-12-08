const express = require("express");
const usersRouter = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { getAllUsers, getUserByUsername, createUser, createOrder } = require("../db");

// UPDATE
usersRouter.get("/", async (req, res) => {
  console.log("request to users");
  const users = await getAllUsers();


  res.send({
    users, 
  });
});

usersRouter.post("/register", async (req, res, next) => {
  const { username, password, cart, canSell } = req.body;

  try {
    let notUser = await getUserByUsername(username)
    if(notUser !== undefined){
      res.send("user exists")
    } else{
    let user = await createUser({username, password, cart, canSell})
    const order = await createOrder({
      userId: user.id,
      products: "{0}",
      isOpen: true
    });
    const token = jwt.sign(
      {
        id: user.id,
        username: username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1w",
      }
    );
    res.send({username, order, token})
    }
  } catch (error) {
    next(error);
  }
});

usersRouter.post("/login", async (req, res, next) => {
    
  const { username, password } = req.body;

  // request must have both
  if (!username || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both a username and password",
    });
  }

  try {
    const user = await getUserByUsername(username);
    if(user.username === username && user.password === password){
      const token = jwt.sign(
        {
          id: user.id,
          username: username,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1w",
        }
      );
      res.send({username, token})
    } else{
      res.send("error, whoopsie daisies!")
    }

  } catch (error) {
    next(error);
  }
});

module.exports = usersRouter;
