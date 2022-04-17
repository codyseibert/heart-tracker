const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const EntrySchema = new Schema({
  symptoms: Number,
  isDariy: Boolean,
  isSalty: Boolean,
  date: String,
});

module.exports =
  mongoose.models.Entry ||
  mongoose.model('Entry', EntrySchema);
