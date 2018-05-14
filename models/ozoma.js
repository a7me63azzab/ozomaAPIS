const mongoose = require("mongoose");
const _ = require('lodash');


const OzomaSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    createdAt:{ type: Date, default: Date.now },
    time:{type:String, required:true},
    _creator:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    goingUsers:[{
        name:{type:String , required:true},
        imageUrl:{type:String, required:true},
        phoneNum:{type:String, required:true}
    }],
    pendingUsers:[{
        name:{type:String , required:true},
        imageUrl:{type:String, required:true},
        phoneNum:{type:String, required:true}
    }],
    notGoingUsers:[{
        name:{type:String , required:true},
        imageUrl:{type:String, required:true},
        phoneNum:{type:String, required:true}
    }],
    dishes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Dishe'
    }]
});

OzomaSchema.methods.toJSON=function(){
    var post = this;
    var postObject = post.toObject();
    return _.pick(postObject,['_id','name','createdAt','time','_creator','goingUsers','pendingUsers','notGoingUsers']);
}

// Sets the createdAt parameter equal to the current time
OzomaSchema.pre('save', next => {
  now = new Date();
  if(!this.createdAt) {
    this.createdAt = now;
  }
  next();
});


var Ozoma = mongoose.model('Ozoma',OzomaSchema);

module.exports={Ozoma};