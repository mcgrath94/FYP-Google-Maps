// Pulls Mongoose dependency for creating schemas
var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

// Creates a User Schema - basis of how user data is stored in the db
var UserSchema = new Schema({
    username: {type: String, required: true}, //name of workbench e.g Galway
    rooms: {type: String, required: true}, //number of rooms
    location: {type: [Number], required: true}, // [Long, Lat]
    testLink: {type: String, required: true}, //link
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
});

// Sets the created_at to current time
UserSchema.pre('save', function(next){
    now = new Date();
    this.updated_at = now;
    if(!this.created_at) {
        this.created_at = now
    }
    next();
});

// Indexes this schema in 2dsphere format - needed for finding distance
UserSchema.index({location: '2dsphere'});

// Exports the UserSchema. Sets the MongoDB collection to be used as: "workbenches" - this is the location of the data
module.exports = mongoose.model('workbench', UserSchema);
