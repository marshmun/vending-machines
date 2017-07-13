
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var itemSchema = new Schema({
    item: {
        type: String,
        required: true
    },
    cost: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model("Item", itemSchema);