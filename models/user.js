const mongoose= require ('mongoose');
const Schema = mongoose.Schema;

const UserSchame= Schema({
    name: String,
    lastname: String,
    email:{
        type:String,
        unique:true
    },
    password: String,
    cell: Number,
    apartmentNumber: Number,
    dateBirth: String,
    role: String,
    active: Boolean
});

module.exports=mongoose.model("user",UserSchame);