const express = require('express');
const { authMiddleware } = require('../middleware');
const { Account } = require('../db');
const { default: mongoose } = require('mongoose');

const router = express.Router();
// balance route
router.get("/balance",authMiddleware,async(req,res)=>{
    const account = await Account.findOne({
        userId:req.userId
    });
    res.json({
        balance:account.balance
    })
})

// transfer route
router.post("/transfer",authMiddleware,async(req,res)=>{
    const session = await mongoose.startSession();
const {amount ,to} = req.body;

// fetch the accounts within the transaction 
const account = await Account.findOne({userId:req.userId}).session(session);

if(!account || account.balance<amount){
    await session.abortTransaction();
    return res.status(400).json({
        message:"insuffient balance"
    });
}

const toAccount = await Account.findOne({userId:to}).session(session);

if(!toAccount){
    await session.abortTransaction();
    return res.status(400).json({
        message:"invalid account"
    });
}

// perforn the transfer
await Account.updateOne({userId:req.userId},{$inc:{balance:amount}})








})
module.exports = router;
