const { response } = require("express");
const { subirArchivo } = require("../helpers/subir-archivo");
const fs = require("fs");
const path = require("path");
const Cards = require("../models/cards");

const cargarArchivo = async (req, res = response) => {
  const { titulo, texto } = req.body;

  if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
    res.status(404).json({ message: "No hay archivos para subir" });
    return;
  }

  try {
    //Imagenes
    const nombre = await subirArchivo(req.files, undefined, "img");
    const cards = new Cards();
    cards.files = nombre;
    cards.titulo = titulo;
    cards.texarea = texto;

    cards.save((err, userStored) => {
      if (err) {
        res.status(404).json({ message: "Error con el servidor" });
      } else {
        res.status(201).json({ message: userStored });
      }
    });
  } catch (error) {
    res.status(201).json({ error });
  }
};

const getNoticias = async (req, res) => {
  Cards.find({}, (err, noticias) => {
    if (err) {
      res.status(404).json({ message: "Error del servidor" });
    } else {
      if (noticias== null || noticias === undefined || noticias.length === 0) {
        res
          .status(404)
          .json({ message: "No hay noticias creadas en el momento" });
      } else {
        res
        .status(200)
        .json(noticias );
        
      } 
    }
  });
}; 

module.exports = {
  cargarArchivo,
   getNoticias,
};
