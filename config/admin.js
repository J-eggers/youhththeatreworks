if(process.env.NODE_ENV === 'production'){
    module.exports = {
        id: process.env.ADMIN_KEY_1,
        id2: process.env.ADMIN_KEY_2,
        id3: process.env.ADMIN_KEY_3,
        id4: process.env.ADMIN_KEY_4,
        id5: process.env.ADMIN_KEY_5, 
        id6: process.env.ADMIN_KEY_6, 
    }
    
} else {
    module.exports = {
        id: '5bc4d96b998ea49da0a007aa',
        id2: "5bc4e5494012a58700715f9b",
        id3: "5bd12cbb65ed1b4268359787"
    }
}
    


