const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
//Import Routes
const userRoute = require('./routes/user');
const postRoute = require('./routes/posts');
const bookRoute = require('./routes/book');

dotenv.config();

//Connect to DB
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false } ,() => console.log('connected to db!'));

//Middleware
app.use(cors());
app.use(morgan('combined'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
//Route Middlewares
app.use('/api/user', userRoute);
app.use('/api/posts', postRoute);
app.use('/api/book', bookRoute);

app.listen(process.env.SERVER_PORT, () => console.log('Server Up and running'));