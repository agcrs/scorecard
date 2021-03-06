var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt-nodejs');

//user Schema
var UserSchema = new Schema({

    google  : {
        id      : {type: String},
        email   : {type: String},
        token   : {
            access_token    : {type: String},
            token_type      : {type: String},
            id_token        : {type: String},
            refresh_token   : {type: String},
            expiry_date     : {type: String}
        },
        changes: {
            startPageToken  : {type: String},
            nextPageToken   : {type: String}
        },
        driveChanges: [{type: Schema.Types.ObjectId, ref: 'DriveChange'}]
    }
});

module.exports = mongoose.model('User', UserSchema);
