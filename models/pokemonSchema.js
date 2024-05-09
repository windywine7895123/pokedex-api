const mongoose = require("mongoose");
const pokemonSchema = new mongoose.Schema({
    Number:{ type: Number},
    Name:{ type : String},
    Type1:{ type : String},
    Type2:{ type : String}
});
module.exports = mongoose.model("pokemon",pokemonSchema)