if (process.env.NODE_ENV === 'production') {
  module.exports = { mongoURI: process.env.MLAB_DATABASE_CONFIG };
} else {
  module.exports = { mongoURI: 'mongodb://localhost/youth-theatre-dev' };
}
