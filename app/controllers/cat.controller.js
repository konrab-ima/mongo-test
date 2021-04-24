const Cat = require('../models/cat.model.js');

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
exports.getAllTags = () => {
    // Cat.find()
    //     .select('tags')
    //     .then(cats => cats.map(c => c.tags))
    //     .then(tags => _.uniq(_.flatten(tags)))
    //     .then(uniqueTags => res.send(uniqueTags))
    //     .catch(err => {
    //         res.status(500).send({
    //             message: err.message || "Some error occurred while retrieving tags."
    //         });
    //     });
};

// Retrieve and return all cats from the database.
exports.findAll = (req, res) => {
    Cat.find({description: {$regex: req.query.tag || ''}})
        .sort('-updatedAt')
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
    const weightLoss = 0.1;
    if(req.cat.weight - weightLoss < 2) {
        res.status(500).send({message:`${req.cat.name} needs to eat`});
        throw new Error('Could not update Cat');
    }
    req.body.weight = Math.round(req.cat.weight*10)/10 - Math.round(weightLoss*10)/10;
    next();
}

exports.feed = (req, res, next) => {
    const weightGain = 0.1;
    if(req.cat.weight - weightGain > 8) {
        res.status(500).send({message:`${req.cat.name} needs to lose weight`});
        throw new Error('Could not update Cat');
    }
    req.body.weight = Math.round(req.cat.weight*10)/10 + Math.round(weightGain*10)/10;
    next();
}

exports.load = (req, res, next, id) =>
    Cat.findById(id)
        .then(m => {
            if (m == null) {throw new Error('Element not found')}
            req.cat = m})
        .then(() => next())
        .catch(err => res.status(500).json({message: `Could not load this Cat (${err})`}));