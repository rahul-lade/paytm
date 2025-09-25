const express = require('express');
const zod = require("zod");
const jwt = require("jsonwebtoken");
const {JWT_SECRET} = require("../config");
const { User } = require('../db');
const { route } = require('./user');
const { authMiddleware } = require('../middleware');

const router = express.Router();

const signupBody = zod.object({
    username:zod.string().email(),
    firstName:zod.string(),
    lastName:zod.string(),
    password:zod.string()
})

router.post("/signup",async(req,res)=>{

const {success} = signupBody.safeParse(req.body)
if(!success){
    return res.status(411).json({
        message:"email already taken /incorrect inputs"
    })
}

const existingUser = await User.findOne({
    username:req.body.username
})
if(existingUser){
    return res.status(411).json({
        message:"email already taken /incorrect imputs"
    })
}
const user = await User.create({
    username:req.body.username,
    password:req.body.password,
    firstName:req.body.firstname,
    lastName:req.body.lastName

})
const userId = user._id;

const token = jwt.sign({
    userId
},JWT_SECRET);
res.json({
    message:"user created successfully",
    token:token
    })

})

// sign in route
const signinBody = zod.object({
    username:zod.string().email(),
    password:zod.string()
})
router.post("/signin",async (req,res)=>{
    const{success} = signinBody.safeParse(req.body)
    if(!success){
        return res.status(411).json({
            message:"incorrect inputs"
        })
    }

    const user = await User.findOne({
        username:req.body.username,
        password:req.body.password
    });
    if(user){
        const token = jwt.sign({
            userId:user._id
        },JWT_SECRET);
        res.json({
            token:token
        })
        return;
    }
res.status(411).json({
    message:"error while logging in"
})

})

// route for updating user info 
const updateBody = zod.object({
    password:zod.string().optional(),
    firstName:zod.string.optional,
    lastName:zod.string.optional()
})
router.put("/",authMiddleware,async(req,res)=>{
    const {success} = updateBody.safeParse(req.body)
    if(!success){
        res.status(411).json({
            message:"error while updating information"
        })
    }

    await User.updateOne({_id:req.userId},req.body);

    res.json({
        message:"updated successfully"
    })
})


// routes to get users from backend ( filter users )
router.get("/bulk",async(req,res)=>{

    const filter = req.query.filter ||"";

    const users = await User.find({
         $or: [
    { firstName: { "$regex": filter } },
    { lastName:  { "$regex": filter } }
  ]
    })
    res.json({
        user:users.map(user=>({
            username:user.username,
            firstName:user.firstName,
            lastName:user.lastName,
            _id:user._id
        }))
    })
})

module.exports = router;