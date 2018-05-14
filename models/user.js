const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const _=require("lodash");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
    imageUrl:{type:String},
    fullName:{type:String, required:true , unique:true},
    phoneNum:{
        type : String , unique : true, required : true
    },
    phoneNumberVerified: {type:Boolean ,default:false},
    verificationCode:{
        type:Number
    },
    age:{type:Number, required:true},
    sex:{type:String, required:true},
    tokens:[{
        access:{
            type:String,
            require:true
        },
        token:{
            type:String,
            require:true
        }
    }],
    ozomat:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Ozoma'
    }],
});

UserSchema.methods.toJSON=function(){
    var user = this;
    var userObject = user.toObject();
    return _.pick(userObject,['_id','imageUrl','fullName','phoneNum','phoneNumberVerified','age','sex']);
}

UserSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access},'abc123').toString();

    user.tokens.push({access, token});

    return user.save().then(() => {
      return token;
    });
  };

  UserSchema.statics.findByToken = function(token){
      var User = this;
      var decoded;
      try{
        decoded = jwt.verify(token,'abc123');
      }catch(err){
         return Promise.reject();
      }
      return User.findOne({
          '_id':decoded._id,
          'tokens.token':token,
          'tokens.access':'auth'
      })
  }

  UserSchema.methods.removeToken = function(token){
    var user = this;
    return user.update({
        $pull:{
            tokens:{token}
        }
    });

  }



var User = mongoose.model('User', UserSchema);
module.exports={User};
