import express from 'express'
import cors from 'cors'

const app = express();
app.use(cors());
app.use(express.json());

let currentItems = {};

app.get('/api/detections', (req, res) => {
  res.json({ items: currentItems });
});

app.post('/api/detections', (req, res) => {
  const { items } = req.body;
  if (items && typeof items === 'object') {
    currentItems = items;
  }
  res.status(200).json({ status: 'updated', items: currentItems });
});

app.listen(3000, () => {
  console.log('Server listening on http://localhost:3000');
});