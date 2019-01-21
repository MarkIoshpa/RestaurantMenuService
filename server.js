const express = require('express')
const restCtl = require('./controllers/restaurant.ctl')
const app = express()
const port = process.env.PORT || 3000

/* Server settings */

app.set('port', port)
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With, Content-Type, Accept");
    res.set("Content-Type", "application/json");
    next();
})

/*  All routes  */

app.get('/getDishes/:name', restCtl.getDishes)
app.get('/getSpecialDishes/:name', restCtl.getSpecialDishes)
app.post('/addDish', restCtl.addDish)
app.post('/editDish', restCtl.editDish)
app.post('/deleteDish', restCtl.deleteDish)
app.post('/addRestaurant', restCtl.addRestaurant)

/*              */

/* API documentation */
app.get('/', (req,res) => {res.redirect('https://documenter.getpostman.com/view/5696798/RzteUYYn')})

/* global route handler */
app.all('*', (req, res) => {
    res.status(404).send('Route does not exist')
})

/* Start server */
app.listen(port, () => console.log(`Server listening on port ${port}`))