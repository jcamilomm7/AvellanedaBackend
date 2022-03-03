const express = require("express");
const UserController = require("../controllers/user");


const api = express.Router();
api.post("/sign-up", UserController.signUp);
api.post("/sign-in", UserController.signIn);
api.get("/get-users", UserController.getUsers);
api.delete("/delete-user", UserController.deleteUser);
api.post("/get-user", UserController.getUser);
api.put("/update-user", UserController.updateUser);
api.post("/get-email",UserController.getEmail)
api.post("/get-apartmentnumber",UserController.getApartmentNumber)
module.exports = api;
