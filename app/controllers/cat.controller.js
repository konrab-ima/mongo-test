const Cat = require('../models/cat.model.js');
const _ = require('lodash');

// Create and Save a new Cat
exports.create = (req, res) => {
    // Create a Cat
    const cat = new Cat(req.body);

    // Save Cat in the database
    cat.save()
        .then(data => res.json(data))
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the cat."
            });
        });
};

// Retrieve and return all cats from the database.
exports.getAllTags = (req, res) => {
    Cat.find({}, 'tags description')
        .then(cats => cats.map(c => c.tags))
        .then(tags => _.uniq(_.flatten(tags)))
        .then(uniqueTags => res.send(uniqueTags))
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving tags."
            });
        });
};

exports.getStatistics = (req, res) => {
    Cat.find()
        .then( cats => cats.reduce((a,b) => a+b.weight, 0) / cats.length)
        .then( meanWeight => res.json([{"meanWeight": meanWeight}]
        ));
};


// Retrieve and return all cats from the database.`
exports.findAll = (req, res) => {
    Cat.find({description: {$regex: req.query.tag ? `#${req.query.tag}` : ''}})
        .sort('-createdAt')
        .then(cats => res.send(cats))
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving cats."
            });
        });
};


// Find a single cat with a catId
exports.findOne = (req, res) => {
    Cat.findById(req.params.catId)
        .then(cat => {
            if (!cat) {
                return res.status(404).send({
                    message: "Cat not found with id " + req.params.catId
                });
            }
            res.send(cat);
        }).catch(err => {
        if (err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "cat not found with id " + req.params.catId
            });
        }
        return res.status(500).send({
            message: "Error retrieving Cat with id " + req.params.catId
        });
    });
};

// Update a cat identified by the catId in the request
exports.update = (req, res) => {
    // Find cat and update it with the request body
    Cat.findByIdAndUpdate(req.params.catId, req.body, {new: true})
        .then(Cat => {
            if (!Cat) {
                return res.status(404).send({
                    message: "Cat not found with id " + req.params.catId
                });
            }
            res.send(Cat);
        }).catch(err => {
        if (err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Cat not found with id " + req.params.catId
            });
        }
        return res.status(500).send({
            message: "Error updating Cat with id " + req.params.catId
        });
    });
};

// Delete a cat with the specified catId in the request
exports.delete = (req, res) => {
    Cat.findByIdAndRemove(req.params.catId)
        .then(Cat => {
            if (!Cat) {
                return res.status(404).send({
                    message: "Cat not found with id " + req.params.catId
                });
            }
            res.send({message: "Cat deleted successfully!"});
        }).catch(err => {
        if (err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Cat not found with id " + req.params.catId
            });
        }
        return res.status(500).send({
            message: "Could not delete Cat with id " + req.params.catId
        });
    });
};

exports.play = (req, res, next) => {
    const weightLoss = -(Math.round(((Math.floor(Math.random() * 20) / 100) + 0.01) * 100) / 100);
    weightChange(req, res, weightLoss);
    next();
}

exports.feed = (req, res, next) => {
    let gainFactor;
    switch (req.query.food) {
        case 'grass':
            gainFactor = 0.01;
            break;
        case 'fish':
            gainFactor = 0.04;
            break;
        default:
            gainFactor = 0.07;
    }
    let weightGain = Math.round(((Math.floor(Math.random() * 20) / 100) + gainFactor) * 100) / 100;
    weightChange(req, res, weightGain);
    next();
}

exports.load = (req, res, next, id) =>
    Cat.findById(id)
        .then(m => {
            if (m == null) {
                throw new Error('Element not found')
            }
            req.cat = m
        })
        .then(() => next())
        .catch(err => res.status(500).json({message: `Could not load this Cat (${err})`}));

function weightChange(req, res, weight) {
    if (req.cat.weight + weight > 8 || req.cat.weight + weight < 2) {
        if (weight > 0) {
            res.status(500).send({message: `${req.cat.name} needs to lose weight`});
            throw new Error('Could not update Cat');
        }
        if (weight < 0) {
            res.status(500).send({message: `${req.cat.name} needs to eat`});
            throw new Error('Could not update Cat');
        }
    }
    req.body.weight = Math.round((req.cat.weight + weight) * 100) / 100;
}



