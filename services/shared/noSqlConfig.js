const mongoose = require('mongoose');
mongoose.connect('mongodb://josuegcardoso:e296cd9f@172.20.0.4:27017/admin');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    createDate: String,
    guid: String
}, { collection: 'account' }
);

module.exports = { Mongoose: mongoose, UserSchema: userSchema }