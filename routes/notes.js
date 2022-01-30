const express = require('express');
const fetchuser = require('../middleware/fetchuser');
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator');
const Comments = require('../models/Comments');

const router = express.Router();

/************************************ Get all Public notes GET: '/api/notes/' Login NOT Required ************************************/
router.get('/', async (req, res) => {
    try {
        const notes = await Notes.find({ status: 'public' }).sort({ _id: -1 });
        res.json(notes);
    } catch (error) {
        //* Send Internal Server Error
        console.error(error.message);
        res.status(500).send("Some error occured");
    }
});

/************************************ Get all notes of a User GET: '/api/notes/user' Login Required ************************************/
router.get('/user', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id }).sort({ _id: -1 });
        res.json(notes);
    } catch (error) {
        //* Send Internal Server Error
        console.error(error.message);
        res.status(500).send("Some error occured");
    }
})

/************************************ Add notes to DB POST: '/api/notes/addnote' Login Required ************************************/
router.post('/addnote', fetchuser, [
    //* Adding Validations using express-validator
    body('title', 'Enter a Valid title').isLength({ min: 3 }),
    body('description', 'Description must have atleast 5 charecters').isLength({ min: 5 }),
    body('status', 'Invalid Status').isIn(['private', 'public'])
], async (req, res) => {
    try {
        const { title, description, tag, status } = req.body;
        //* check errors and send Bad requests 
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()[0] });
        }
        //* Create a new Notes object and save it to DB
        const note = new Notes({
            user: req.user.id,
            title,
            description,
            tag,
            status
        })
        const savedNote = await note.save();
        res.json(savedNote);
    } catch (error) {
        //* Send Internal Server Error
        console.error(error.message);
        res.status(500).send("Some error occured");
    }
})

/************************************ Update a note PUT: '/api/notes/updatenote' Login Required ************************************/
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    try {
        const { title, description, tag, status } = req.body;
        //* Create a new note object with the feilds which should be updated
        const updatedNote = {};
        if (title) { updatedNote.title = title }
        if (description) { updatedNote.description = description }
        if (tag) { updatedNote.tag = tag }
        if (status) { updatedNote.status = status }

        //* Find the note and update it if it belongs to the user
        let note = await Notes.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ error: "Note not Found" });
        }
        if (note.user.toString() !== req.user.id) {
            return res.status(401).json({ error: "Note not Found" });
        }

        note = await Notes.findByIdAndUpdate(req.params.id, updatedNote, { new: true });
        res.json({ note });

    } catch (error) {
        //* Send Internal Server Error
        console.error(error.message);
        res.status(500).send("Some error occured");
    }
})

/************************************ Delete a note DELETE: '/api/notes/deletenote' Login Required ************************************/
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        //* Find the note and delete it if it belongs to the user
        let note = await Notes.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ error: "Note not Found" });
        }
        if (note.user.toString() !== req.user.id) {
            return res.status(401).json({ error: "Note not Found" });
        }

        note = await Notes.findByIdAndDelete(req.params.id);
        res.json({ "Success": "Note has been deleted", "note": note });

    } catch (error) {
        //* Send Internal Server Error
        console.error(error.message);
        res.status(500).send("Some error occured");
    }
})

/************************************ LIKE a note PUT: '/api/notes/like/:id' Login Required ************************************/
router.put('/like/:id', fetchuser, async (req, res) => {
    try {
        let note = await Notes.findByIdAndUpdate(req.params.id, {
            $addToSet: { likes: req.user.id }
        }, { new: true });
        res.json({ "note": note })
    } catch (error) {
        //* Send Internal Server Error
        console.error(error.message);
        res.status(500).send("Some error occured");
    }
})

/************************************ UNLIKE a note PUT: '/api/notes/unlike/:id' Login Required ************************************/
router.put('/unlike/:id', fetchuser, async (req, res) => {
    try {
        let note = await Notes.findByIdAndUpdate(req.params.id, {
            $pull: { likes: req.user.id }
        }, { new: true });
        res.json({ "note": note })
    } catch (error) {
        //* Send Internal Server Error
        console.error(error.message);
        res.status(500).send("Some error occured");
    }
})


/*************************** GET ALL COMMENTS of a note GET: '/api/notes/comment/:id' Login Required {_id of blog} **************************/
router.get('/comment/:id', fetchuser, async (req, res) => {
    try {
        const comments = await Comments.find({ postId: req.params.id }).sort({ _id: 1 });
        res.json(comments);
    } catch (error) {
        //* Send Internal Server Error
        console.error(error.message);
        res.status(500).send("Some error occured");
    }
})

/*************************** COMMENT on a note POST: '/api/notes/comment/:id' Login Required {_id of blog} **************************/
router.post('/comment/:id', fetchuser, [
    body('comment', 'Can\'t post a empty comment').notEmpty()
], async (req, res) => {
    try {
        //* check errors and send Bad requests 
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()[0] });
        }
        const comment = new Comments({
            user: req.user.id,
            postId: req.params.id,
            comment: req.body.comment
        });
        const saveComment = await comment.save();
        res.json(saveComment);
    } catch (error) {
        //* Send Internal Server Error
        console.error(error.message);
        res.status(500).send("Some error occured");
    }
})

module.exports = router;