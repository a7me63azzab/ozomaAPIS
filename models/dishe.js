const mongoose = require("mongoose");
const _ = require('lodash');


const DisheSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    imageUrl:{
        type:String,
        required:true
    },
    requiredNum:{
        type:Number,
        required:true
    },
    available:{
        type:Number,
        required:true
    },
    _belongTo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Ozoma',
        required:true
    }
});

DisheSchema.methods.toJSON=function(){
    var dishe = this;
    var disheObject = dishe.toObject();
    return _.pick(disheObject,['_id','name','imageUrl','requiredNum','available']);
}




var Dishe = mongoose.model('Dishe',DisheSchema);

module.exports={Dishe};