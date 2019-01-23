const mongoose = require('mongoose')
const Restaurant = require('../models/restaurant')
const Consts = require('../consts')
var ObjectId = require('mongodb').ObjectID

/*  getDishes recieves request with get http verb 
    The req parameter contains the name of the restaurant
    getDishes sends response containing json with all dishes data  */

exports.getDishes  = (req, res) => {
    name = req.params.name

    // query
    Restaurant.find({'name': {$eq: name}}, 
        (err, result) => {
            if (err) res.status(500).json(err.message)
            else if ( (result.length == 0) || (result === undefined) ) res.status(404).json('Not found')
            // return all dishes of found restaurant
            else res.json(result[0]['dishes'])
        }
    )
}

/* getSpecialDishes recieves request with get http verb 
   The req parameter contains the name of the restaurant
   getSpecialDishes return response containing json
   with the 6 latest dishes of the restaurant */

exports.getSpecialDishes = (req, res) => {
    name = req.params.name

    // query
    Restaurant.find({'name': {$eq: name}}, 
        (err, result) => {
            if (err) res.status(500).send(err.message)
            else if ( (result.length == 0) || (result === undefined) ) res.status(404).json('Not found')
            // return first 6 dishes sorted by date descending from restaurant
            else res.json(result[0]['dishes'].sort((a, b) => {return b.date - a.date;}).slice(0, 6))
        }
    )
}

/*  addDishes recieves request with post http verb 
    The req parameter contains the body of the request with the following fields:
    id (of the restaurant), name, category, description, price(dish data fields)
    and images (contains image urls seperated by spaces) 
    addDishes adds the new dish to the restaurant dishes array */

exports.addDish = (req, res) => {
    // check for id field
    if(req.body.id === undefined) {
        res.status(400).json('Id field required in body!')
    }

    // get data from body
    let dishData = {
        name = null,
        category = null,
        description = null,
        price = null,
        images = null,
        date = null
    } = req.body

    if(req.body.imagesURL !== undefined) {
        dishData.images = req.body.imagesURL.split(" ")
    }
    
    dishData.date = Date.now()

    // prepare document for query
    const doc = {
        $push: { dishes : {
            name: dishData.name,
            category: dishData.category,
            description: dishData.description,
            price: dishData.price,
            images: dishData.images,
            date: dishData.date
        }}
    }

    // query
    Restaurant.updateOne({'id': {$eq: req.body.id}}, doc, 
        (err, result) => {
            if(err) res.status(500).send(err.message)
            res.json(result)
        }
    )
}

/*  editDishes recieves request with post http verb 
    The req parameter contains the body of the request with the following fields:
    id (of the restaurant), dish_id, name, category, description, price(dish data fields)
    and images (contains image urls seperated by spaces) 
    editDishes updates the dish (specified by dish_id) with the new data */

exports.editDish = (req, res) => {
    // check if id fields are defined
    if(req.body.id === undefined) {
        res.status(400).json('id field required in body!')
    }

    if(req.body.dish_id === undefined) {
        res.status(400).json('dish_id field required in body!')
    }

    // get data from body
    dishData = {
        name = null,
        category = null,
        description = null,
        price = null,
        images = null,
        date = null
    } = req.body

    if(req.body.imagesURL !== undefined) {
        dishData.images = req.body.imagesURL.split(" ")
    }

    dishData.date = Date.now()
    
    // prepare query document
    const doc = {
        $set: { dishes : {
            name: dishData.name,
            category: dishData.category,
            description: dishData.description,
            price: dishData.price,
            images: dishData.images,
            date: dishData.date
        }}
    }

    // query
    Restaurant.updateOne({'id': {$eq: req.body.id}, dishes: { $elemMatch: { 'dishes._id': {$eq: ObjectId(req.body.dish_id)}} } } , doc, 
        (err, result) => {
            if(err) res.status(500).json(err.message)
            res.json(result)
        }
    )
}


/*  deleteDishes recieves request with post http verb 
    deleteDishes deletes the dish specified by dish_id field in the request body */

exports.deleteDish = (req,res) => {
    // check id fields
    if(req.body.id === undefined) {
        res.status(400).json('id field required in body!')
    }

    if(req.body.dish_id === undefined) {
        res.status(400).json('dish_id field required in body!')
    }

    // query
    Restaurant.updateOne({'id' : {$eq: req.body.id}}, {$pull: {dishes : { _id : ObjectId(req.body.dish_id) }}}, 
        (err, result) => {
            if(err) res.status(500).json(err.message)
            res.json(result)
        }
    )
}

/* addRestaurant receives request with post http verb
   addRestaurant creates new restaurant in database using
   id field and name field. The dishes field will be empty.
   Requires db password field to be sent in body  */

exports.addRestaurant = (req, res) => {
    const {id = null, name = null} = req.body

    if(req.body.password === Consts.DB_PASS)
        Restaurant.create({id, name}, 
            (err, result) => {
                if(err) res.status(500).json(err.message)
                res.json(result)
            }
        )
    else {
        res.status(400).json('Invalid Password, enter password to add a restaurant.')
    }
}