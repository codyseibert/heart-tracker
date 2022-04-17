const mongoose = require('mongoose');

module.exports = async function connectToDb() {
  await mongoose.connect(
    'mongodb://localhost/heart-tracker'
  );
};
