if(process.env.NOD_ENV === 'procduction'){
    module.exports = require('./keys_prod');
} else {
    module.exports = require('./keys_dev')
}