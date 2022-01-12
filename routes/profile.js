const express = require('express');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchuser');
const multer  = require('multer')

// Storage staratagy for multer
const storageStrategy = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        if(file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
            const extension = file.mimetype.slice(6,file.mimetype.length);
            cb(null, uniqueSuffix + '.' + extension)
        }
    }
})
const upload = multer({ storage: storageStrategy });
const router = express.Router();

//* ADD PROFILE PICTURE POST: '/api/profile/add-profile-picture'
router.post('/add-profile-picture', fetchuser, upload.single('profilePicture'), async (req, res)=>{ 
    try {
        console.log(req.file);
        const user = await User.findByIdAndUpdate(req.user.id, {profileImg: req.file.path}).select("-password");
        res.json(user);
    } catch (error) {
        //* Send Internal Server Error
        console.error(error.message);
        res.status(500).send("Some error occured");
    }
});

//* UPDATE PROFILE INFO PUT: '/api/profile/edit'
router.put('/edit', fetchuser,[
    //* Adding Validations using express-validator
    body('gender', 'Invalid sex.').isIn(['M','F','NA']),
    body('dob', 'Enter a Valid Date.').isLength({ min: 6 }),
    body('bio', 'Bio must have atleast 15 charecters.').isLength({ min: 15 }),
    body('city', 'Enter a valid city Name.').isLength({ min: 2 })
] ,async(req, res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()[0] });
    }
    const newDoc = {
        gender: req.body.gender,
        dob: req.body.dob,
        bio: req.body.bio,
        city: req.body.city
    }
    const user = await User.findByIdAndUpdate(req.user.id, newDoc, {new:true}).select("-password");
    res.json(user);
    // console.log(req.body);
    
})

//* Fetch User Data using GET: '/api/profile/' Login Required
router.get('/', fetchuser, async (req,res)=>{
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.send(user);
    } catch (error) {
        //* Send Internal Server Error
        console.error(error.message);
        res.status(500).send("Some error occured");
    }
})

module.exports = router;