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
    
    
    
    app.delete('/dishe/delete/:id',(req,res)=>{
        var id = req.params.id;
        console.log('id',id)

        if(!ObjectID.isValid(id)){
            return res.status(404).send();
        }

        Dishe.findByIdAndRemove({
            _id:id
        }).then((dishe)=>{
            if(!dishe){
                return res.status(404).send({message:" dishe not found"});
            }
            console.log('ozoma id' , dishe._belongTo)
           // DELETE DISHE FROM THE OZOMA
            Ozoma.findById({_id:dishe._belongTo}).then(ozoma=>{
                console.log('ozoma' , ozoma)
                if(!ozoma) return res.status(400).send({message: '3zomz not found'})
                ozoma.dishes.pull(id);
                ozoma.save();
            })

            res.status(200).send({dishe});
        }).catch((err)=>{
          res.status(404).send({err});
        });
        
    });
    
    // UPDATE DONATION 
    app.patch('/dishe/update/:id',authenticate,(req,res)=>{
        
        var id = req.params.id;
        var body = {
            name:req.body.name,
            imageUrl:req.body.imageUrl,
            requiredNum:req.body.requiredNum,
            available:req.body.available,
            _belongTo:req.body.ozomaId
        }

        if(!ObjectID.isValid(id)){
            res.status(404).send();
        }
         
    
        Dishe.findByIdAndUpdate({
            _id:id,
        },{$set:body},{new:true}).then((dishe)=>{
         if(!dishe){
             res.status(404).send();
         }
          res.send({dishe});
        }).catch((err)=>{
          res.status(400).send();
        });
    
    });
    
    
}