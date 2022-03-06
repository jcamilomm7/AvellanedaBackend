const mongoose = require("mongoose");
const app = require("./app");
const port = process.env.PORT || 2750;
const { API_VERSION, IP_SERVER, PORT_DB } = require("./config");

mongoose.connect(
  `mongodb+srv://avellaneda:medellin22@avellaneda.vq2no.mongodb.net/avellaneda?retryWrites=true&w=majority`,
  { useNewURLParser: true, useUnifiedTopoLogy: true },
  (err, res) => {
    if (err) {
      throw err;
    } else {
      console.log("La conexion con la base de datos es correcta.");

      app.listen(port, () => {
        console.log("############################");
        console.log("###### API REST ############");
        console.log("############################");
        console.log(`http://${IP_SERVER}:${port}/api/${API_VERSION}/`);
      });
    }
  }
);
