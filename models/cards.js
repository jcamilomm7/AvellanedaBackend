const mongoose= require ('mongoose');
const Schema = mongoose.Schema;

const CardsSchame= Schema({
    titulo: String,
    files: String,
    texarea: String,
});

module.exports=mongoose.model("cards",CardsSchame);