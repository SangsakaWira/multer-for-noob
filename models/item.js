const mongoose = require("mongoose")

const itemSchema = mongoose.Schema({
    path:String,
    filename:String,
    user_id:String,
    time_uploaded:{
        type:String
    }
})

const item = mongoose.model("item",itemSchema) 

module.exports = item