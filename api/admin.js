const express = require("express");
const adminRouter = express.Router();
const jwt = require("jsonwebtoken");

const { verifyAdmin } = require("../db");

adminRouter.post("/", async (req, res) => {
    const {username, password} = req.body
    try{
  const isAdmin = await verifyAdmin(username, password);
  if(isAdmin){
    const token = jwt.sign(
        {
          id: 0,
          username: username,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1w",
        }
      );
      res.send({username, token})
  } else{
      res.send("you're not an admin!")
  }
} catch (error){
    console.log(error)
}
});


module.exports = adminRouter;