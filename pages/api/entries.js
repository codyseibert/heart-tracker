import Entry from '../../api-lib/models/Entry';
import connectToDb from '../../api-lib/db';

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    await connectToDb();
    // get today's date in format of YYYY-MM-DD
    const todaysDate = new Date()
      .toISOString()
      .slice(0, 10);

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
  } else {
    res.status(404).end('Not found');
  }
}
