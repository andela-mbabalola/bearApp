var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Bear = require('./app/models/bear');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = 9900;

var router = express.Router();

mongoose.connect('mongodb://localhost/firstsync')

router.use((req, res, next) => {
    console.log("Everything is fine");
    next();
});

router.get('/', (req, res) => {
    console.log("I'm working");
    res.json({message: 'I worked!'})
});

router.route('/bear')
    .post((req, res) => {
        var bear = new Bear();
        bear.name = req.body.name;
        bear.type = req.body.type;

        bear.save((err) => {
            if (err) 
                res.send(err);
            res.json({ message: 'Bear saved!' });
        });
    });

router.route('/bears')
    .get((req, res) => {
        Bear.find((err, bears) => {
            if (err) res.send(err);
            res.json(bears);
        });
    });

router.route('/bears/:bear_id')
    .get((req, res) => {
        Bear.findById(req.params.bear_id, (err, bear) => {
            if (err) res.send(err);
            res.json(bear);
        });
    });

router.route('/bears/:bear_id')
    .put((req, res) => {
        Bear.findById(req.params.bear_id, (err, bear) => {
            if (err) res.send(err);
            
            bear.name = req.body.name;
            bear.type = req.body.type;

            bear.save((err) => {
                if (err) res.send(err);
                res.json({message: 'Bear Updated!'});
            });
        });
    });

router.route('/bears/:bear_id')
    .delete((req, res) => {
        Bear.remove({
            _id: req.params.bear_id
        }, (err, bear) => {
            if (err) res.send(err);
            res.json({message: 'Bear Deleted!'});
        });
    });

app.use('/api', router);

app.listen(port);
console.log('Connection successful ' + port);