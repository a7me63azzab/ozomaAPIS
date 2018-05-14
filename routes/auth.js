const _=require("lodash");
const {ObjectID} = require("mongodb");
const {mongoose} = require("../db/mongoose");
const {User} = require("../models/user");

const accountSid = 'AC686904f73e1e29fc675d0a37560b5e29';
const authToken = 'f2c5e0fa58f4ae49c1890c807cfdfbb4';
const client = require('twilio')(accountSid,authToken);


// GENERATE RANDOM CODE
var rand = function(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
  }; 

module.exports = function(app){
        // USER REGISTER
        app.post('/user/register',(req, res) => {

            //CHECK IF USER IS REGISTERED BEFORE OR NOT
            User.findOne({
              phoneNum:req.body.phoneNum
            }).then(user =>{
                if(!user){
                    var body={
                        fullName:req.body.fullName,
                        phoneNum:req.body.phoneNum,
                        imageUrl:req.body.imageUrl,
                        age:req.body.age,
                        sex:req.body.sex
                    }
                    var user = new User(body);
  
                    user.save().then(() => {
                    return user.generateAuthToken();
                    }).then((token) => {
                    res.header('x-auth', token).send({isExist:false,user:user});
                  }).catch((err) => {
                    res.status(400).send(err);
                    })
                }else{
                  return res.status(404).send({isExist:true});
                }
              }).catch(err=>{
                res.status(404).send(err);
              });
          });


        //GET ALL USERS
        app.get('/users',(req,res)=>{
            User.find({}).then(users =>{
                if(!users) return res.status(404).send();
                res.send({users});
            }).catch(err=>{
                res.status(400).send();
            });
        });



        //GET USER BY ID
        app.get('/user/:id',(req, res)=>{
            let id = req.params.id;
            if(!ObjectID.isValid(id)) return res.status(404).send();

            User.findOne({
                _id:id
            }).then(user=>{
                if(!user) return res.status(404).send();
                res.send({user});
            }).catch(err=>{
                res.status(400).send();
            });
        });


          // USER LOGIN
          app.post('/user/login',(req, res)=>{
            if(!req.body.phoneNum) return res.status(400).send({message:'there is no phone number'})
            User.findOne({
                phoneNum:req.body.phoneNum
            }).then(user =>{
                if(!user) return res.status(404).send();
                return  user.generateAuthToken().then((token)=>{
                    res.header('x-auth', token).send(user);
                }); 
            }).catch(err=>{
                res.status(400).send({error:err})
            })
          })


          // LOGIN USER WITH PHONE NUMBER AND IF NUMBER VERIFIED GENERATE AUTHTOKEN
        app.post('/user/send',(req,res)=>{
            let phoneNum = req.body.phoneNum;
            if(!req.body.phoneNum) return res.status(400).send({message: 'there is no phone number !'})
            
            // get the user by phone number
            User.findOne({
              phoneNum:phoneNum
            }).then(user => {
              if(!user) return res.status(404).send({message: 'There is no user with this phone number'});
              var verificationCode = rand(100000, 999999);
              console.log('verificationCode',verificationCode);
              client.messages.create({
                  to:phoneNum,
                  from:'+12672027059',
                  body:`Your code is ${verificationCode}`
                }).then(message=>{
                    console.log(message.sid)
                    // Add verification code to user collection
                    User.findByIdAndUpdate({
                      _id:user._id
                    },{$set:{verificationCode:verificationCode}},{new:true}).then(user=>{
                      if(!user) return res.status(404).send();
                        res.status(200).send(user);
                    }).catch(err=>{
                        res.status(404).send();
                    })
                }).catch(err=>{
                    console.log(err)
                })

            })
        })

        // Verify phone number to login user
        app.post('/user/verify',(req, res)=>{
          let code = req.body.verificationCode;
          if(!req.body.verificationCode) return res.status(400).send({message: 'there is no verification Code !'});
          User.findOne({
            verificationCode:code
          }).then(user=>{
            if(!user) return res.status(404).send({message: 'Code is not correct'});
            // update verified number is user
            User.findByIdAndUpdate({
              _id:user._id
            },{$set:{phoneNumberVerified:true ,verificationCode:''}},{new:true}).then(user=>{
              if(!user) return res.status(404).send();
              return  user.generateAuthToken().then((token)=>{
                res.header('x-auth', token).send(user);
              });
            }).catch(err=>{
                res.status(404).send();
            })
          })
        })
        
}