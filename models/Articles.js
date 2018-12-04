const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

//Create Schema 
const ArticlesSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    body:{
        type: String,
        required: true
        
    },
    date:{
        type: Date,
        default: Date.now
        
    }
});

mongoose.model('articles', ArticlesSchema);