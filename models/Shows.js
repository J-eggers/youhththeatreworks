const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Cast Schema
const CastSchema = new Schema({
  kidname: {
    type: String,
    required: true
  },
  kidID: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  parentName: {
    type: String,
    required: true
  },
  part: {
    type: String,
    required: false
  },
  phone: {
    type: String,
    required: true
  }
});

//Create Schema
const ShowSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  showDate: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  rehearsal: {
    type: String,
    required: false
  },
  reminder: {
    type: String,
    required: false
  },
  cast: [
    {
      kidname: {
        type: String
      },
      kidID: {
        type: String,
        required: true
      },
      email: {
        type: String
      },
      parentName: {
        type: String
      },
      phone: {
        type: String
      }
    }
  ]
});

mongoose.model('shows', ShowSchema);
mongoose.model('cast', CastSchema);
