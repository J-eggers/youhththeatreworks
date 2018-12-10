const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const QuoteSchema = new Schema({
  quote: {
    type: String,
    required: true
  },
  person: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('quote', QuoteSchema);
