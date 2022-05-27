import Entry from '../../../api-lib/models/Entry';
import connectToDb from '../../../api-lib/db';
import nc from 'next-connect';
import { ncOptions } from '../../../api-lib/ncOptions';

const handleGet = async (req, res) => {
  await connectToDb();

  const { yearMonth } = req.query;

  const expectedYearMonth = /^\d\d\d\d\-\d\d$/;
  if (!expectedYearMonth.test(yearMonth)) {
    res.status(400).send('Invalid yearMonth');
    return;
  }

  const existingEntries = await Entry.find({
    date: {
      $regex: new RegExp(`^${yearMonth}`),
    },
  });

  res.status(200).json(existingEntries);
};

export default nc(ncOptions).get(handleGet);
