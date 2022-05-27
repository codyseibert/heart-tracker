import Entry from '../../../api-lib/models/Entry';
import connectToDb from '../../../api-lib/db';
import { dataPoints } from '../../../business/dataPoints';
import { pick } from 'lodash';
import nc from 'next-connect';
import { ncOptions } from '../../../api-lib/ncOptions';

const dataPointKeys = Object.keys(dataPoints);

const isValidYearMonthDay = (dateString) => {
  return /^\d\d\d\d\-\d\d-\d\d$/.test(dateString);
};

const handlePut = async (req, res) => {
  await connectToDb();

  const { dateString } = req.query;

  if (!isValidYearMonthDay(dateString)) {
    return res.status(400).send('Invalid yearMonth');
  }

  const existingEntry = await Entry.findOne({
    date: dateString,
  });
  let entryToReturn;

  if (existingEntry) {
    Object.assign(existingEntry, {
      symptoms: req.body.symptoms,
      notes: req.body.notes,
      ...pick(req.body, dataPointKeys),
    });
    await existingEntry.save();
    entryToReturn = existingEntry;
  } else {
    const entry = new Entry({
      symptoms: req.body.symptoms,
      notes: req.body.notes,
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

  if (!isValidYearMonthDay(dateString)) {
    return res.status(400).send('Invalid yearMonth');
  }

  const existingEntry = await Entry.findOne({
    date: dateString,
  });

  const defaultEntry = {
    symptoms: 2,
    notes: '',
    ...dataPointKeys.reduce(
      (acc, key) => ({
        ...acc,
        [key]: false,
      }),
      {}
    ),
  };

  let entryToReturn = existingEntry || defaultEntry;

  res.status(200).json(entryToReturn);
};

export default nc(ncOptions).get(handleGet).put(handlePut);
