const express = require('express');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const  bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();
const JWT_SECRET = 'This@is@a@secret@which@everyone@knows';

//* Register a User using POST: '/api/auth/register'
router.post('/register',[
    //* Adding Validations using express-validator
    body('name', 'Enter a Valid name.').isLength({ min: 3 }),
    body('email', 'Enter a Valid Email').isEmail(),
    body('password', 'Password must have atleast 5 charecters.').isLength({ min: 5 }),
], async (req,res)=>{
    try {
        //* check errors and send Bad requests 
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        //* Check if a User with the same email already exists
        let user = await User.findOne({email: req.body.email});
        if(user){
            return res.status(400).json({error: 'A user with the given email alredy exists.Please login to continue.'})
        }
        //* Hashing and Salting Password
        bcrypt.hash(req.body.password, 10, async (err,hash)=>{
            //* Create and save a User in the DB
            if(!err){
                user = await User.create({
                    name: req.body.name,
                    email: req.body.email,
                    password: hash,
                })
                const data = {
                    user:{
                        id: user.id
                    }
                }
                const authToken = jwt.sign(data, JWT_SECRET);
                // console.log(jwtData);
                res.json({authToken});
            }
        })

    } catch (error) {
        //* Send Internal Server Error
        console.error(error.message);
        res.status(500).send("Some error occured");
    }
})

module.exports = router;