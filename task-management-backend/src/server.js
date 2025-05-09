const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDatabase = require('./config/connectDatabase');

dotenv.config({ path: path.join(__dirname, 'config', 'config.env') });
const port = process.env.PORT || 3000;

connectDatabase();

const auth = require('./routes/auth.route');
const task = require('./routes/task.route');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Default Route
app.get('/', (req, res) => res.send("Api is working!"));

app.use('/auth', auth);
app.use('/task', task);

app.listen(port, () => {
  console.log(`Server started at ${port}`);
});