const express = require("express");
const sellersRouter = express.Router();
const jwt = require("jsonwebtoken");
const { getAllSellers, getSellerByUsername, createSeller } = require("../db");

sellersRouter.get("/", async (req, res) => {
  console.log("request to sellers");
  const sellers = await getAllSellers();
  console.log(sellers)
  res.send({
    sellers,
  });
});

sellersRouter.post("/register", async (req, res, next) => {
  const { username, password, description, products, canSell } = req.body;

  try {
    let notSeller = await getSellerByUsername(username)
    if(notSeller !== undefined){
      res.send("user exists")
    } else{
    let user = await createSeller({ username, password, description, products, canSell})
    console.log(user)
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
    }
  } catch (error) {
    next(error);
  }
});

sellersRouter.post("/login", async (req, res, next) => {
    
  const { username, password } = req.body;

  // request must have both
  if (!username || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both a username and password",
    });
  }

  try {
    console.log(username)
    const user = await getSellerByUsername(username);
    console.log(user)
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
    console.log(error);
    next(error);
  }
});

module.exports = sellersRouter;
