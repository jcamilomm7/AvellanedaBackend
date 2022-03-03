const express = require("express");
const bodyParser = require("body-parser");
const fileUpload = require('express-fileupload')
const app = express();
const { API_VERSION } = require("./config");

//middlewares

//Fileupload - carga de archivos 
app.use(fileUpload({
  useTempFiles:true,
  temFileDir:'/tmp',
  createParentPath:true
}))

//load routings
const userroutes = require("./routers/user");
const uploadsroutes= require("./routers/uploads");


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configure Header HTTP
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

//Router basic
app.use(`/api/${API_VERSION}`, userroutes);
app.use(`/api/${API_VERSION}`, uploadsroutes)

module.exports = app;
