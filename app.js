var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
var Item = require("./models/item.js")
var Purchase = require("./models/purchase.js");


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

app.post("/api/customer/:id/:cash", (req, res) => {
  Item.findOne({ _id: req.params.id }).then(foundItem => {
    if (!foundItem || foundItem.quantity === 0) {
      return res.send("This item you requested is not in this machine!");
    }
    var change = req.params.cash - foundItem.cost;
    if (foundItem.cost > req.params.cash) {
      return res.send({
        message: "Please pay more for the item requests. The item you're trying to buy is",
        item_cost: foundItem.cost
      });
    }

    var newPurchaseData = {
      item_bought: foundItem.item,
      cost: foundItem.cost,
      money_paid: req.params.cash,
      change_returned: change
    };
    var newPurchase = new Purchase(newPurchaseData);
    newPurchase
      .save()
      .then(savedPurchase => {
        var newQuantity = foundItem.quantity - 1;
        foundItem.quantity = newQuantity;
        foundItem.save()
        res.send({ status: "success", purchase_id: savedPurchase._id, message: "Thank you for your purchase!", your_change: savedPurchase.change_returned });
      })
      .catch(err => {
        res.status(500).send(err);
      });
  });
});

app.get("/api/vendor/purchases", (req, res) => {
  Purchase.find()
    .then(purchases => {
      res.send({ status: "success", purchases });
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

app.get("/api/vendor/money", (req, res) => {
  Purchase.find()
    .then(data => {
      var totalCash = 0;
      data.forEach(function (item) {
        totalCash += item.cost;
        return totalCash;
      });
      res.send({ status: "success", CashInMachine: totalCash });
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

app.post("/api/vendor/items", (req, res) => {
  let newItemData = req.body;
  let newItem = new Item(newItemData);
  newItem
    .save()
    .then(savedItem => {
      res.send({ status: "success", record: savedItem });
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

app.put("/api/vendor/items/:id", (req, res) => {
  Item.updateOne({ _id: req.params.id }, req.body)
    .then(updatedItem => {
      res.send({ status: "success", update: updatedItem });
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

app.delete("/api/vendor/items/delete/:id", (req, res) => {
  Item.deleteOne({ _id: req.params.id })
    .then(item => {
      res.send("Record Deleted");
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

app.delete("/api/vendor/purchase/delete/:id", (req, res) => {
  Purchase.deleteOne({ _id: req.params.id })
    .then(item => {
      res.send("Record Deleted");
    })
    .catch(err => {
      res.status(500).send(err);
    });
});


module.exports = app;


// POST /api/customer/items/:itemId/purchases - purchase an item
// GET /api/vendor/purchases - get a list of all purchases with their item and date/time
// GET /api/vendor/money - get a total amount of money accepted by the machine
// POST /api/vendor/items - add a new item not previously existing in the machine
// PUT /api/vendor/items/:itemId - update item quantity, description, and cost