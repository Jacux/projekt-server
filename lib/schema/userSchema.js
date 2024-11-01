const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: { type: String, required: true, maxlength: 50  },
    email: { type: String, required: true, unique: true, maxlength: 120 },
    password: { type: String,required: true, minlength: 8 }
  });
  
  const User = mongoose.model('User', userSchema);

  module.exports =  {User}
  