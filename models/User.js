const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  kidname: [
    {
      name: String,
      registered: {
        type: Boolean,
        default: false
      },
      age: {
        type: String,
        required: false
      },
      allergies: {
        type: String,
        required: false
      },
      experience: {
        type: String,
        required: false
      },
      sizes: {
        shirt: {
          type: String,
          required: false
        },
        pants: {
          type: String,
          required: false
        }
      }
    }
  ],
  phone: {
    type: String,
    required: true
  },
  subscribed: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  rank: {
    type: String,
    required: false
  },
  resetPasswordToken: {
    type: String,
    required: false
  },
  resetPasswordExpires: {
    type: Date,
    required: false
  }
});

mongoose.model('users', UserSchema);
