import Entry from '../../api-lib/models/Entry';
import connectToDb from '../../api-lib/db';

const handlePut = async (req, res) => {
  await connectToDb();
  // get today's date in format of YYYY-MM-DD
  const todaysDate = new Date().toISOString().slice(0, 10);

  const existingEntry = await Entry.findOne({
    date: todaysDate,
  });
  let entryToReturn;

  if (existingEntry) {
    Object.assign(existingEntry, {
      symptoms: req.body.symptoms,
      isDariy: req.body.isDairy,
      isSalty: req.body.isSalty,
    });
    await existingEntry.save();
    entryToReturn = existingEntry;
  } else {
    const entry = new Entry({
      symptoms: req.body.symptoms,
      isDariy: req.body.isDairy,
      isSalty: req.body.isSalty,
      date: todaysDate,
    });

    await entry.save();
    entryToReturn = entry;
  }

  res.status(200).json(entryToReturn);
};

const handleGet = async (req, res) => {
  await connectToDb();

  const todaysDate = new Date().toISOString().slice(0, 10);

  const existingEntry = await Entry.findOne({
    date: todaysDate,
  });

  res.status(200).json(existingEntry);
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
