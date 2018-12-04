const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

//Cost of Ticekt 
const OrderSchema = new Schema ({
    adult:{
        type:String
    },
    child:{
        type:String
    },
    amount:{
        type:String
    }
})



//Ticket Schema 
const TicketSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
        
    },
    adultTicket:{
        type: Number,
        required: true
    },
    childTicket:{
        type: Number,
        required: false
        
    }
    
});

//All Ticket Schema 
const ModelsTicket = new Schema({
    title:{
        type: String,
        required: true
    },
    showDate:{
        type: Date,
        required: true
        
    },
    published:{
        type:Boolean,
        default: true
    },
    cost:{
        adult:{
            type: Number,
            default: 15
        },
        child:{
            type: Number,
            default: 10
        }
    },
    ticket:[{
        name:{
            type: String,
           
        },
        email:{
            type: String,
         
            
        },
        adultTicket:{
            type: Number,
          
        },
        childTicket:{
            type: Number,
        }
            
    }],
    date:{
        type: Date,
        default: Date.now
        
    }
    
});

mongoose.model('modelsTicket', ModelsTicket);
mongoose.model('ticket', TicketSchema);
mongoose.model('order', OrderSchema);