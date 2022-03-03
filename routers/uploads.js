const express = require("express");
const UserController = require("../controllers/uploads");


const api=express.Router()
api.post("/cargar-archivos",UserController.cargarArchivo);

module.exports = api;
