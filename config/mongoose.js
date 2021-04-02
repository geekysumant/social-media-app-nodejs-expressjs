const mongoose=require('mongoose');
const env=require('./environment');
mongoose.connect(`mongodb://localhost/${env.db}`);

var db=mongoose.connection;

db.on('error',console.error.bind(console,'Error connecting to db'));
db.once('on',()=>{
    console.log("successfully connected to db!");
})