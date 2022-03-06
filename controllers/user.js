const bcrypt = require("bcrypt-nodejs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const signUp = (req, res) => {
  const user = new User();

  const {
    name,
    lastName,
    email,
    password,
    repeatPassword,
    cell,
    dateBirth,
    apartmentNumber,
  } = req.body;
  user.name = name;
  user.lastname = lastName;
  user.email = email;
  user.cell = cell;
  user.dateBirth = dateBirth;
  user.apartmentNumber = apartmentNumber;
  if (email === "jc.mesa@pascualbravo.edu.co") {
    user.role = "admin";
  } else {
    user.role = "user";
  }

  if (!password || !repeatPassword) {
    res.status(404).send({ messaje: "Las contraseñas son obligatorias" });
  } else {
    if (password !== repeatPassword) {
      res.status(404).send({ messaje: "Las contraseñas deben ser iguales" });
    } else {
      bcrypt.hash(password, null, null, (err, hash) => {
        if (err) {
          res.status(500).send({ message: "Error al encryptar la contraseña" });
        } else {
          user.password = hash;
          user.save((err, userStored) => {
            if (err) {
              res.status(500).send({ message: "Usuario ya existe" });
            } else {
              if (!userStored) {
                res.status(404).send({ message: "Error al crear el usuario" });
              } else {
                //Generar/Crear token

                let token = jwt.sign(
                  {
                    id: userStored._id,
                    email: userStored.email,
                  },
                  "misiontic2022UPB"
                );
                res.status(201).json({ message: userStored });
              }
            }
          });
        }
      });
    }
  }
};

const signIn = (req, res) => {
  const params = req.body;
  const email = params.email.toLowerCase();
  const password = params.password;

  User.findOne({ email }, (err, userStored) => {
    if (err) {
      res.status(500).send({ message: "Error del servidor" });
    } else {
      if (!userStored) {
        res.status(404).send({ message: "Usuario no encontrado" });
      } else {
        bcrypt.compare(password, userStored.password, (err, check) => {
          if (err) {
            res.status(500).send({ message: "Eror del servidor" });
          } else if (!check) {
            res.status(404).send({ message: "La contraseña es incorrecta" });
          } else {
            let token = jwt.sign(
              {
                id: userStored._id,
                email: userStored.email,
              },
              "misiontic2022UPB"
            );
            res.status(201).json({ token });
          }
        });
      }
    }
  });
};

const getUsers = (req, res) => {
  User.find().then((users) => {
    if (users.length === 0) {
      res.status(201).send("no se ha encontado ningun usuario");
    } else {
      res.status(200).json(users);
    }
  });
};

const deleteUser = (req, res) => {
  const { email } = req.body;
 
  if (!email) {
    res.status(404).json({ message: "Ingresar email" });
  } else {
    User.findOneAndDelete({ email }, function (err, docs) {
      if (err) {
        res.status(404).json({ message: "Error del servidor" });
      } else {
        if (docs === null) {
          res.status(404).json({ message: "El usuario no existe" });
        } else {
          res
            .status(404)
            .json(
              `Usuario: ${docs.name} ${docs.lastname} con correo electronico asociado: ${docs.email} ha sido elimado con exito`
            );
        }
      }
    }); 
  }
};

const getUser = (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(404).json({ message: "Ingresar email" });
  } else {
    User.find({ email }, function (err, docs) {
      if (err) {
        res.status(404).json({ message: "Error del servidor" });
      } else {
        if (docs.length ===0) {
          res.status(200).json({ message: "El usuario no existe" });
        } else {
          res.status(200).json(docs);
        }
      }
    });
  }
};

const updateUser = (req, res) => {
  const user = new User();

  const id = req.body._id;
  user.name = req.body.name;
  user.lastname = req.body.lastname;
  user.email = req.body.email;
  user.password = req.body.password;
  user.cell = req.body.cell;
  user.dateBirth = req.body.dateBirth;
  user.apartmentNumber = req.body.apartmentNumber;

  User.findOne({ _id: id }, (err, usuario) => {
    if (err) { 
      res.status(404).json({ message: "El usuario no existe" });
    } else {
      User.findOne({ email: user.email }, (err, result) => {
        if (err) {
          res.status(404).json({ message: "Error con la base de datos" });
        } else {
          if (
            result === null ||
            result === undefined ||
            result.email === usuario.email
          ) {
            if (user.password !== usuario.password) {
              bcrypt.hash(user.password, null, null, (err, hash) => {
                if (err) {
                  res
                    .status(500)
                    .json({ message: "Error al encryptar la contraseña" });
                } else {
                  user.password = hash;
                  User.updateOne(
                    { _id: id },
                    {
                      $set: {
                        name: user.name,
                        lastname: user.lastname,
                        email: user.email,
                        password: user.password,
                        cell: user.cell,
                        dateBirth: user.dateBirth,
                        apartmentNumber: user.apartmentNumber,
                      },
                    },
                    (err, result) => {
                      if (err) {
                        res
                          .status(404)
                          .json({ message: "Error al actualizar usuario" });
                      } else {
                        res.status(404).json({ usuario });
                      }
                    }
                  );
                }
              });
            } else {
              User.updateOne(
                { _id: id },
                {
                  $set: {
                    name: user.name,
                    lastname: user.lastname,
                    email: user.email,
                    password: user.password,
                    cell: user.cell,
                    dateBirth: user.dateBirth,
                    apartmentNumber: user.apartmentNumber,
                  },
                },
                (err, result) => {
                  if (err) {
                    res
                      .status(404)
                      .json({ message: "Error al actualizar usuario" });
                  } else {
                    res.status(404).json(true);
                  }
                }
              );
            }
          } else {
            res.status(404).json({message:"El email ya esta en uso por otra persona"});
          }
        } 
      });
    }
  });
};
const getEmail = (req, res) => {
  const { email } = req.body;

  if (email === null || email === undefined || email === "") {
    res.status(404).json({ message: "Debes ingresar un correo" });
  } else {
    User.findOne({ email: email }, (err, user) => {
      if (err) {
        res.status(404).json({ message: "Error con el servidor" });
      } else {
        if (user === null) {
          res.status(404).json({ message: "El usuario no existe" });
        } else {
          res.status(404).json(user); 
        }
      }
    });
  }
};

const getApartmentNumber = (req, res) => {
  const { apartmentNumber } = req.body;

  if (
    apartmentNumber === null || 
    apartmentNumber === undefined ||
    apartmentNumber === ""
  ) {
    res
      .status(404)
      .json({ message: "Debes ingresar un numero de apartamento" });
  } else {
    User.find({ apartmentNumber: apartmentNumber }, (err, user) => {
      if (err) {
        res.status(404).json({ message: "Error con el servidor" }); 
      } else {
        if (user === null || user === undefined || user.length === 0) {
          res.status(404).json({
            message: `No hay usuarios relacionados con el apartamento: ${apartmentNumber}`,
          });
        } else {
          res.status(404).json(user);
        }
      }
    });
  }
};
module.exports = {
  signUp,
  signIn,
  getUsers,
  deleteUser,
  getUser,
  updateUser,
  getEmail,
  getApartmentNumber,
};
