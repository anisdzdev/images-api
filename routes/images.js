const auth = require('../middleware/auth');
const {Image, validateImage} = require('../models/image');
const {User} = require('../models/user');
const express = require('express');
const multer = require("multer");
const _ = require("lodash")

const fs = require('fs');
const path = require('path')


const router = express.Router();

const {promisify} = require('util');
const unlinkAsync = promisify(fs.unlink);
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const path = `public/images/${req.user._id}`
        fs.mkdirSync(path, { recursive: true })
        cb(null, path)
    },
    filename: function (req, file, cb) {
        cb(null, req.user._id + '_' + Date.now() + path.extname(file.originalname))
    }
});

var getFields = multer({ 
    storage: storage,
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            return callback(new Error('Only images are allowed'))
        }
        callback(null, true)
    },
});

router.get('/:id', getFields.any(), async (req, res) => {
    const image = await Image.findById(req.params.id);
    res.send(image);
});

router.get('/user/:id', getFields.any(), async (req, res) => {
    const images = await Image.find({user:req.params.id}).select('_id title link last_updated');
    res.send(images);
});

router.get('/search/:query', getFields.any(), async (req, res) => {
    if(!req.params.query) return res.status(404).send("Please enter a valid search term")
    const words = []
    req.params.query.split(" ").forEach(word => words.push(new RegExp(word, "i")));
    const images = await Image.find({$or: [
        { "title": { "$in": words } },
        { "description": { "$in": words } },
    ]});
    if(!images || images.length===0) return res.status(404).send("Nothing found, try checking your query")
    res.send(images);
});


router.post('/', [auth, getFields.single("image")], async (req, res) => {
    const file = req.file;
    if(!file) return res.status(400).send('Please upload a file');

    const {error} = validateImage(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const image = new Image(_.pick(req.body, ['title', 'description']));
    image.date = Date.now();
    image.user = req.user._id;
    image.link = "localhost:3000/files/"+req.user._id + "/" +req.file.filename;
    image.last_update = image.date;
    await image.save();

    res.send(image);
});

router.patch('/:id', [auth, getFields.any()], async (req, res) => {
    const image = req.body;
    if(!image) return res.status(404).send("Image not found");

    delete image.link
    delete image.user
    delete image.date
    image.last_update = Date.now();

    const current = await Image.findById(req.params.id);
    if(req.user._id !== current.user) return res.status(403).send("Access denied, the image does not belong to you.");


    const updatedImage = await Image.findByIdAndUpdate(req.params.id, image,  {new: true});
    if(!updatedImage) return res.status(500).send("Error while updating image");
    console.log(updatedImage)
    res.send(updatedImage);
})

router.delete('/:id', [auth, getFields.none()], async (req, res) => {
    
    const image = await Image.findById(req.params.id).select('-password');
    if (!image) return res.status(404).send('The image with the given ID was not found.');
    if(req.user._id !== image.user) return res.status(403).send("Access denied, the image does not belong to you.");
    
    await Image.findByIdAndDelete(req.params.id)
    res.send(image);
});



module.exports = router;