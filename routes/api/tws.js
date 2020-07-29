const express = require('express');
const mongoose = require('mongoose');

const Router = express.Router();

const Tw = require('../../models/Tw');
const testMiddleware = require('../../middelwares/test');

var tws = [];

// Router.get('/', testMiddleware, (req, res) => {
//     // res.status(200).send('GET Tws');
//     res.status(200).json(tws);
// })

Router.get('/',(req,res)=>{
    Tw.find()
        .lean()
        .exec()
        .then(tws=>{
            res.status(200).json(tws);
        })
        .catch(err =>{
            error=err;
            console.error(error);
        });
})
Router.get('/:twId', (req, res) => {
    twId = req.params.twId;

    tw = tws.filter((tw) => {
        return tw.id == twId;
    });

    // res.status(200).send('GET Tw Id: ' + twId);
    res.status(200).json(tw);
})

Router.post('/', (req, res) => {
    console.log(req.body.message);
    
    if (req.body.message && req.body.message != "") {
        const tw = new Tw({
            _id: new mongoose.Types.ObjectId(),
            message: req.body.message
        })
        
        tw.save()
            .then(tw => {
                res.status(200).send(tw);
            })
            .catch(err => {
                res.status(500).json({error: err});    
            })
    } else {
        res.status(500).json({error: "Please put some values"});    
    }
})


Router.delete('/:twId', (req, res) => {
    twId = req.params.twId;

    Tw.remove({
        _id: twId
    })
        .exec()
        .then(result => {
            res.status(200).json({ 'message': 'Suppression du twitt !' });
        })
        .catch(err => {
            error = err;
            console.error(error);
        });
})


Router.patch('/:twId',(req,res)=>{
    console.log("Patch method");
    twId = req.params.twId;
    message=req.body.message;   
    if (req.body.message && req.body.message != "") {
        Tw.update({ _id: twId }, {
                $set: {
                    message: req.body.message,
                }
            })
            .exec()
            .then(tw => {

                res.status(200).json(tw);
            })
            .catch(err => {

                res.status(500).json({ error: err });
            });
    } else {
        res.status(500).json({ error: 'Merci de remplire tous les champs' });
    }

})

module.exports = Router;