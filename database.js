const mongoose = require('mongoose')
const consts = require('./consts')

// Database connection constants and options
const {MLAB_URL, DB_USER,  DB_PASS} = consts
const url = MLAB_URL
const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    user: DB_USER,
    pass: DB_PASS,
    autoReconnect: true
}

// Connect to mongodb
mongoose
    .connect(url, options)
    .then( () => console.log('Connected to database.'))
    .catch( err => console.log(`Database connection error: ${err}`))