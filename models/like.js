const mongoose = require('mongoose');

const likeSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    likeable:{
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'onModel'
    },
    onModel: {
        type:String,
        required: true,
        enum:['Post','Comment']
    }
},{timestamps:true});

module.exports=mongoose.model('Like',likeSchema);