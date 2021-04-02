const mongoose=require('mongoose');


const tokenSchema = new mongoose.Schema({
    userId :  {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required : true
    },
    token: {
        type: String,
        required:true
    },
    // expire_at: {
    //     type: Date,
    //     default: Date.now(),
    //     required: true,
    //     expireAfterSeconds: 60
    // }
})

module.exports = mongoose.model('Token',tokenSchema);