'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const contributor = new Schema({
    name: {
        type: String,
        required: [true, "can't be blank"],
    },
    district: [{
        name: String,
        code: String,
        ward: [{
            name: String,
            code: String
        }]
    }]
});
module.exports = mongoose.model('publisher', publisher);