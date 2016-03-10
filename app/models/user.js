var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt-nodejs');

//user Schema
var UserSchema = new Schema({

    local   : {
        email       : {type: String, index: {unique: true }},
        password    : {type: String, select: false}
    },
    google  : {
        id      : {type: String},
        email   : {type: String},
        name    : {type: String},
        token   : {
            access_token    : {type: String},
            token_type      : {type: String},
            refresh_token   : {type: String},
            expiry_date     : {type: String}
        }

    }

});

//Hash the password before the user is saved
UserSchema.pre('save', function(next)   {
    var user = this;

    //hash only if pass change or new user
    if(!user.isModified('local.password') && !user.local.password) return next();

    //hash
    bcrypt.hash(user.local.password, null, null, function(err, hash)  {
        if (err) return next(err);

        user.local.password = hash;
        next();
    });
});

//compare given password with db hash
UserSchema.methods.comparePassword = function(password) {
    var user = this;

    return bcrypt.compareSync(password, user.local.password);
};

module.exports = mongoose.model('User', UserSchema);
