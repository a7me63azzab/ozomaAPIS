const {Ozoma} = require('../models/ozoma');
const _=require("lodash");
const {ObjectID} = require("mongodb");
const {authenticate} =require('../middleware/authenticate');


module.exports = (app)=>{
     //CREATE NEW OZOMA
     app.post('/ozoma/create',authenticate,(req, res)=>{
        
        let ozomaData = {
            name:req.body.name,
            time:req.body.time,
            _creator:req.user._id
        }
        let ozoma = new Ozoma(ozomaData);
        ozoma.save().then((ozoma)=>{
            if(!ozoma) return res.status(404).send();
            res.status(200).send(ozoma);
        }).catch(err=>{
            res.status(404).send();
        });
    });


    //GET OZOMA BY ID
    app.get('/ozoma/:id',authenticate,(req, res)=>{
        let id = req.params.id;
        if(!ObjectID.isValid(id)) return res.status(404).send();

        Ozoma.findOne({
            _id:id
        }).then(ozoma=>{
            if(!ozoma) return res.status(404).send();
            res.send({ozoma});
        }).catch(err=>{
            res.status(400).send();
        });
    });

     //GET ALL ozoma's
     app.get('/ozomat',authenticate,(req,res)=>{
        Ozoma.find({}).then(ozomat =>{
            if(!ozomat) return res.status(404).send();
            res.send({ozomat});
        }).catch(err=>{
            res.status(400).send();
        });
    });

    //ADD GOING USER TO OZOMA
    app.post('/ozoma/going/:id',authenticate,(req, res)=>{
        Ozoma.findByIdAndUpdate({
            _id:req.params.id
        },{
             "$push": { "goingUsers": {
                 name:req.user.fullName,
                 imageUrl:req.user.imageUrl,
                 phoneNum:req.user.phoneNum
             } } 
          },{new:true}).then(ozoma =>{
            if(!ozoma) return res.status(400).send('ozoma not found')
            res.status(200).send(ozoma)
          }).catch(err=>{
              res.status(400).send({err})
          })
    })

    
    //ADD INTERESTED USER TO OZOMA
    app.post('/ozoma/pending/:id',authenticate,(req, res)=>{
        Ozoma.findByIdAndUpdate({
            _id:req.params.id
        },{
             "$push": { "pendingUsers": {
                 name:req.user.fullName,
                 imageUrl:req.user.imageUrl,
                 phoneNum:req.user.phoneNum
             } } 
          },{new:true}).then(ozoma =>{
            if(!ozoma) return res.status(400).send('ozoma not found')
            res.status(200).send(ozoma)
          }).catch(err=>{
              res.status(400).send({err})
          })
    })

    //ADD PENDING USER TO OZOMA
    app.post('/ozoma/notgoing/:id',authenticate,(req, res)=>{
        Ozoma.findByIdAndUpdate({
            _id:req.params.id
        },{
             "$push": { "notGoingUsers": {
                 name:req.user.fullName,
                 imageUrl:req.user.imageUrl,
                 phoneNum:req.user.phoneNum
             } } 
          },{new:true}).then(ozoma =>{
            if(!ozoma) return res.status(400).send('ozoma not found')
            res.status(200).send(ozoma)
          }).catch(err=>{
              res.status(400).send({err})
          })
    })
}