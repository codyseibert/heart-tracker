import Entry from '../../../api-lib/models/Entry';
import connectToDb from '../../../api-lib/db';

const handleGet = async (req, res) => {
  await connectToDb();

  const { yearMonth } = req.query;

  const existingEntries = await Entry.find({
    date: {
      $regex: new RegExp(`^${yearMonth}`),
    },
  });

  res.status(200).json(existingEntries);
};

export default async function handler(req, res) {
  if (req.method === 'GET') {
    await handleGet(req, res);
  } else {
    res.status(404).end('Not found');
  }
}
