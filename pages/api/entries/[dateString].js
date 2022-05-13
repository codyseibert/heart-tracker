import Entry from '../../../api-lib/models/Entry';
import connectToDb from '../../../api-lib/db';
import { dataPoints } from '../../../business/dataPoints';
import { pick } from 'lodash';

const dataPointKeys = Object.keys(dataPoints);

const handlePut = async (req, res) => {
  await connectToDb();

  const { dateString } = req.query;

  const existingEntry = await Entry.findOne({
    date: dateString,
  });
  let entryToReturn;

  if (existingEntry) {
    Object.assign(existingEntry, {
      symptoms: req.body.symptoms,
      ...pick(req.body, dataPointKeys),
    });
    await existingEntry.save();
    entryToReturn = existingEntry;
  } else {
    const entry = new Entry({
      symptoms: req.body.symptoms,
      ...pick(req.body, dataPointKeys),
      date: dateString,
    });

    await entry.save();
    entryToReturn = entry;
  }

  res.status(200).json(entryToReturn);
};

const handleGet = async (req, res) => {
  await connectToDb();

  const { dateString } = req.query;

  const existingEntry = await Entry.findOne({
    date: dateString,
  });

  let entryToReturn = existingEntry || {
    symptoms: 2,
    ...dataPointKeys.reduce(
      (acc, key) => ({
        ...acc,
        [key]: false,
      }),
      {}
    ),
  };

  res.status(200).json(entryToReturn);
};

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    await handlePut(req, res);
  } else if (req.method === 'GET') {
    await handleGet(req, res);
  } else {
    res.status(404).end('Not found');
  }
}
