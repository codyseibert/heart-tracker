import mongoose from 'mongoose';

import { dataPoints } from '../../business/dataPoints';

const Schema = mongoose.Schema;

const EntrySchema = new Schema({
  symptoms: Number,
  ...Object.keys(dataPoints).reduce(
    (acc, key) => ({
      ...acc,
      [key]: Boolean,
    }),
    {}
  ),
  date: String,
});

export default mongoose.models.Entry ||
  mongoose.model('Entry', EntrySchema);
