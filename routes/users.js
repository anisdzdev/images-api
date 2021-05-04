const {sendEmail} = require("../utils/email");

const auth = require('../middleware/auth');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const {User, validate, validate_auth} = require('../models/user');

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const multer = require("multer");

const router = express.Router();

const upload = multer();

router.post('/login', upload.none(), async (req, res) => {
    const {error} = validate_auth(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email: req.body.email});
    if (!user) return res.status(400).json({error: {form: 'Invalid Credentials'}});

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).json({error: {form: 'Invalid Credentials'}});

    const token = user.generateAuthToken();
    const id = user._id;
    res.send({id, token});
});

router.post('/create', upload.none(), async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email: req.body.email});
    if (user) return res.status(400).send('User already registered.');

    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    const token = user.generateAuthToken();
    const id = user._id;
    res.send({id, token});
});


router.delete('/', [auth, upload.none()], async (req, res) => {
    const user = await User.findByIdAndDelete(req.user._id).select('-password');
    if (!user) return res.status(404).send('The user with the given ID was not found.');

    res.send(user);
});


module.exports = router;