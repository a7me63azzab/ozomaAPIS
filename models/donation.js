const mongoose = require("mongoose");
const _ = require('lodash');


const DonationSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    phoneNum:{
        type:String,
        required:true
    },
    imageUrl:{
        type:String,
        required:true
    },
    url:{
        type:String,
        required:true
    }
});

DonationSchema.methods.toJSON=function(){
    var donation = this;
    var donationObject = donation.toObject();
    return _.pick(donationObject,['_id','name','phoneNum','imageUrl','url']);
}




var Donation = mongoose.model('Donation',DonationSchema);

module.exports={Donation};