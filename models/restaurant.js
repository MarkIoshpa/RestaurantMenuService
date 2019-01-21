const mongoose = require('mongoose')
const dish = require('./dish.js')
const Schema = mongoose.Schema

var restaurant = new Schema({
    id: { type: Number, required:true, index: 1 },
    name: { type:String, required:true },
    dishes: [dish]
})

module.exports = mongoose.model('Restaurant', restaurant)