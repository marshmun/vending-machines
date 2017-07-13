const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var transactionSchema = new Schema({
    item_bought: {
        type: String,
        required: true
    },
    cost: {
        type: Number,
        required: true
    },
    money_paid: {
        type: Number,
        required: true
    },
    change_returned: {
        type: Number,
        required: true,
        default: 0
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now
    }
})

module.exports = mongoose.model("Transaction", transactionSchema);