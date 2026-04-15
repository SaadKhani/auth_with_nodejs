const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log('conected to dataa baase');
}).catch((err) => {
    console.log('Error ' + err);
});