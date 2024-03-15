require('dotenv').config()

const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cors());

// routes
const loginRoutes = require('./routes/login');
app.use('/', loginRoutes);

const userDataRoutes = require('./routes/userData');
app.use('/userData', userDataRoutes);

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});