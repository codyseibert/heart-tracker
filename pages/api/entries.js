export default function handler(req, res) {
  if (req.method === 'POST') {
    console.log(req.body);
    console.log(req.body.isDairy);
    res.end('ok');
  } else {
    res.status(404).end('Not found');
  }
}
