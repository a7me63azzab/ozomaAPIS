const _=require("lodash");
const {ObjectID} = require("mongodb");
const {mongoose} = require("../db/mongoose");
const {Dishe} = require("../models/dishe");
const {Ozoma} = require("../models/ozoma");
const {authenticate} = require("../middleware/authenticate");

module.exports = function(app){

    app.post('/dishe/add',authenticate,(req,res)=>{

        let ozomaId = req.body.ozomaId;

        var newDishe = new Dishe({
            name:req.body.name,
            imageUrl:req.body.imageUrl,
            requiredNum:req.body.requiredNum,
            available:req.body.available,
            _belongTo:req.body.ozomaId
        });
    
        newDishe.save().then((dishe)=>{
            res.status(200).send(dishe);

             //ADD NEW DISHE TO THE OZOMA
             Ozoma.findById({_id:ozomaId}).then(ozoma=>{
                ozoma.dishes.push(newDishe);
                ozoma.save();
            })

        },(err)=>{
            console.log("UNable to save dishe");
            res.status(400).send(err)
            });
    });


    //GET ALL DISHES
    app.get('/dishes',authenticate,(req,res)=>{
         Donation.find({}).then((dishes)=>{
             res.send({dishes});
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
    
    app.delete('/dishe/delete/:id',authenticate,(req,res)=>{
        var id = req.params.id;
        if(!ObjectID.isValid(id)){
            return res.status(404).send();
        }
        Dishe.findByIdAndRemove({
            _id:id
        }).then((dishe)=>{
            if(!dishe){
                return res.status(404).send();
            }

            //DELETE DISHE FROM THE OZOMA
            Ozoma.findById({_id:req.user._id}).then(user=>{
                user.ozomat.pull(id);
                user.save();
            })

            res.send({dishe});
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