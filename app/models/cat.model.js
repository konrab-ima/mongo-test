const mongoose = require('mongoose');

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
        maxLength: 100
    },
    weight: {
        type: Number,
        required: true,
        min: 2,
        max: 8
    },
    tags: [String]
}, {
    timestamps: true
});

module.exports = mongoose.model('cat', CatSchema);