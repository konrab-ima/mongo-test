const mongoose = require('mongoose');
const _ = require('lodash');

const CatSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    owner: {
        type: String,
        required: true,
        enum: ['Birgit', 'Cynthia', 'Daniel']
    },
    description: {
        type: String,
        maxLength: 100,
    },
    weight: {
        type: Number,
        required: true,
        min: 2,
        max: 8
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('cat', CatSchema);