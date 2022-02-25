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
    if (users.length ===0) {
      res.status(404).json({ message: "No se ha encontrad ningun usuario" });
    } else {
      res.status(200).json(users);
    }
  });
};

const deleteUser = (req,res) => {
  const {email}= req.body;
  User.findOneAndDelete({email} , function (err, docs) {
    
    if (err === null){
        res.status(404).json({message: "El usuario no existe"})
    }
    else{
      res.status(404).json({message: `EL usuario con correo : ${docs.email} ha sido eliminado`})

    }
});
}
module.exports = {
  signUp,
  signIn,
  getUsers,
  deleteUser
};
