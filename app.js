var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
var Customers = require("./models/customers.js")
var Item = require("./models/item.js")

const dbUrl = "mongodb://localhost:27017/vendingmachineDB";

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'Mustache');

mongoose.connect(dbUrl).then((err, db) => {
  if (err) {
    console.log("ERROR", err);
  }
  console.log("Connected to the DB");
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', index);
app.use('/users', users);


app.get('/api/customer/items', (req, res) => {
  Item.find().then(foundItems => {
    res.send({ status: "success", foundItems });
  })
    .catch(err => {
      res.status(500).send(err);
    })
})

app.post('/api/customer/items/itemId/purchases', (req, res) => {
  Item.findOne()
})

app.get('/api/vendor/money', (req, res) => {

})

app.post('/api/vendor/items', (req, res) => {
  let itemData = req.body;
  let newItem = new Item(itemData);

  newItem.save().then(savedItem => {
    res.send({ status: 'success', savedItem });
  })
    .catch(err => {
      res.status(500).send(err);
    })
});

app.put('/api/vendor/items/itemId', (req, res) => {
  Item.updateOne({ _id: req.params.id }, req.body)
    .then(updatedItem => {
      res.send({ status: 'success', updatedItem });
    })
    .catch(err => {
      res.status(500).send(err)
    })
})


module.exports = app;


// POST /api/customer/items/:itemId/purchases - purchase an item
// GET /api/vendor/purchases - get a list of all purchases with their item and date/time
// GET /api/vendor/money - get a total amount of money accepted by the machine
// POST /api/vendor/items - add a new item not previously existing in the machine
// PUT /api/vendor/items/:itemId - update item quantity, description, and cost