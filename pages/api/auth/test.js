export default function handler(req, res) {
  return res.status(200).json({ body: req.body, query: req.query });
}
