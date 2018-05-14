const _=require("lodash");
const {ObjectID} = require("mongodb");
const {mongoose} = require("../db/mongoose");
const {Donation} = require("../models/donation");
const {authenticate} = require("../middleware/authenticate");

module.exports = function(app){

    app.post('/donation/add',authenticate,(req,res)=>{

        var donation = new Donation({
            name:req.body.name,
            phoneNum:req.body.phoneNum,
            imageUrl:req.body.imageUrl,
            url:req.body.url
        });
    
        donation.save().then((donation)=>{
            res.status(200).send(donation);
        },(err)=>{
            console.log("UNable to save todo");
            res.status(400).send(err)
            });
    });


    //GET ALL DONATIONS
    app.get('/donations',authenticate,(req,res)=>{
         Donation.find({}).then((donations)=>{
             res.send({donations});
         },(err)=>{
             res.status(400).send(err);
         });
    });
    

    // app.get('/todos/:id',authenticate,(req,res)=>{
    //     var id = req.params.id;
    //     if(!ObjectID.isValid(id)){
    //         return res.status(404).send();
    //     }
    //     Todo.findOne({
    //         _id:id,
    //         _creator:req.user._id
    //     }).then((todo)=>{
    //         console.log("ahmed",todo);
    //         if(!todo){
    //             return res.status(404).send();
    //         }
    //         res.send({todo});
    //     }).catch((err)=>{
    //        res.status(400).send();
    //     });
    // });
    
    app.delete('/donation/delete/:id',authenticate,(req,res)=>{
        var id = req.params.id;
        if(!ObjectID.isValid(id)){
            return res.status(404).send();
        }
        Donation.findByIdAndRemove({
            _id:id
        }).then((donation)=>{
            if(!donation){
                return res.status(404).send();
            }
            res.send({donation});
        }).catch((err)=>{
          res.status(404).send();
        });
        
    });
    
    // UPDATE DONATION 
    app.patch('/donation/update/:id',authenticate,(req,res)=>{
        var id = req.params.id;
        var body = _.pick(req.body,['name','phoneNum','imageUrl','url']);
        if(!ObjectID.isValid(id)){
            res.status(404).send();
        }
         
    
        Donation.findByIdAndUpdate({
            _id:id,
        },{$set:body},{new:true}).then((donation)=>{
         if(!donation){
             res.status(404).send();
         }
          res.send({donation});
        }).catch((err)=>{
          res.status(400).send();
        });
    
    });
    
    
}