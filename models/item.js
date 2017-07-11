var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var itemSchema = new Schema({
    description: String,
    cost: Number,
    quantity: Number
});


module.exports = mongoose.model("Item", itemSchema)