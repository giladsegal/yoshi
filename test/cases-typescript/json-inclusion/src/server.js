import ejs from 'ejs';
import express from 'express';

const app = express();

app.get('/', async (req, res) => {
  res.send(await ejs.renderFile('./src/index.ejs'));
});

app.listen(process.env.PORT);
