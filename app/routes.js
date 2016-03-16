var mongoose        = require('mongoose');
var User            = require('./model.js');

// Opens App Routes
module.exports = function(app) {

    // GET all workbenches
    app.get('/users', function(req, res){


        var query = User.find({});
        query.exec(function(err, users){
            if(err)
                res.send(err);

            // all centres
            res.json(users);
        });
    });

    // POST new workbench
    app.post('/users', function(req, res){

        // Creates a new User based on the Mongoose schema and the post body
        var newuser = new User(req.body);

        // New User saved in db
        newuser.save(function(err){
            if(err)
                res.send(err);

            // JSON of new user
            res.json(req.body);
        });
    });
    
    
    app.post('/query/', function(req, res){

    // Grabs parameters from queryForm
    var lat             = req.body.latitude;
    var long            = req.body.longitude;
    var distance        = req.body.distance;

    //generic Mongoose Query
    var query = User.find({});

    if(distance){

        // MongoDB's geospatial querying features
        query = query.where('location').near({ center: {type: 'Point', coordinates: [long, lat]},

            // metres to km
            maxDistance: distance * 1000, spherical: true});
    }
    
    query.exec(function(err, users){
        if(err)
            res.send(err);

        //respond with a JSON of users that criteria
        res.json(users);
    });
});
};