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
    tags: {
        type: Array,
        get: extractTags
    }
}, {
    timestamps: true
}).set('toJSON', { getters: true });

function extractTags() {
    let regexp = new RegExp('#[A-Za-z0-9]*', 'g');
    if (!this.description) return [];
    const hashtags = this.description.match(regexp) || [];
    return _.uniq(hashtags.map(ht => ht.substring(1)));
}

module.exports = mongoose.model('cat', CatSchema);