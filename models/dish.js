const mongoose = require('mongoose')
const Schema = mongoose.Schema

var dish = new Schema({
    name: { type:String, required:true, index: 1 },
    category: { type:String, required:true },
    description: { type:String, required: true },
    price: { type:Number, required: true },
    date: { type:Date, required: true },
    images: [ {type:String} ]
})

module.exports = dish