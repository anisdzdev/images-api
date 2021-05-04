const express = require('express');
const mongoose = require('mongoose');
const auth = require('./middleware/auth');
const images = require('./routes/images');
const users = require('./routes/users');
const app = express();

mongoose.connect('mongodb://localhost/repo-images', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=>{console.log('Connected to Mongo !')})
    .catch(err => console.log('Could not connect to DB'));

app.use(express.json());
app.use('/api/images', images);
app.use('/api/users', users);

app.use('/files', express.static(__dirname + '/public/images'));

const port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log(`Listening on port ${port}`);
});