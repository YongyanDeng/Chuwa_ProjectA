const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
      email: {
            type: String,
            required: true,
            unique: true
      },
      password: {
            type: String,
            required: true
      },
      username: {
            type: String,
      },
      category: {
            type: String,
            required: true
      },
      cart: [
            {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: 'Product'
            }
      ]
});

const User = mongoose.model('User', userSchema);
module.exports = User;