var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

//user Schema
var DriveChangeSchema = new Schema({

    user    : {type: Schema.Types.ObjectId, ref: 'User'},

    fileId  : {type: String},
    removed : {type: Boolean},
    time    : {type: Date}
});

module.exports = mongoose.model('DriveChange', DriveChangeSchema);
