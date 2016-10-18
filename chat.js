var mongoose = require('mongoose');

var chatSchema = mongoose.Schema({
     userName : String,
     messege : String,
     created :{type : Date, default : Date.now}
});

module.exports = mongoose.model('chat', chatSchema);