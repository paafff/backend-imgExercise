const express = require('express');
const cors = require('cors');
const productRouter = require('./routes/Product');

const app = express();

app.use(cors({ credentials: true, origin: `http://localhost:3000` }));

app.use(productRouter);

app.use(express.static('uploads'));

app.listen(5000, () => {
  console.log('server running...');
});
