let mongoose = require("mongoose");

let userSchema = new mongoose.Schema(
    {
        username : {
            type:String,
            required: true,
            unique: true
        },
        password : {
            type:String,
            required: true
        }
    });

let User = new mongoose.model("User", userSchema);

module.exports = User;