const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();
const connectDb = require('./config/db');


const app = express();

connectDb();
const port = process.env.NODE_LOCAL_PORT || 3020;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set the 'views' directory to 'public' (where your EJS files are)
app.set('views', path.join(__dirname, 'public'));

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    // Render the index.ejs file
    res.render('index');
});

app.use('/', require('./routes/api'));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
