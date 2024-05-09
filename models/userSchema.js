const mongoose = require("mongoose");
const users = new mongoose.Schema({
    username:{ type: String, unique: true},
    password:{ type: String},
    firstname:{ type: String},
    lastname:{ type: String},
    rank:{ type: String},
    email:{ type: String}
});
module.exports = mongoose.model("users",users)