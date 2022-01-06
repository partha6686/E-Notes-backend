const connectMongo = require('./db');
const express = require('express');
const cors = require('cors');

connectMongo();
const app = express();
const port = 3300;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads',express.static('uploads'))

app.use(cors())

// All Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes',require('./routes/notes'));
app.use('/api/profile',require('./routes/profile'));

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})