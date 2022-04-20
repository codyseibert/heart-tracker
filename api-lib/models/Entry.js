import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const EntrySchema = new Schema({
  symptoms: Number,
  isDairy: Boolean,
  isSalty: Boolean,
  date: String,
});

export default mongoose.models.Entry ||
  mongoose.model('Entry', EntrySchema);
