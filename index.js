import express from 'express';
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import {registerValidator} from "./validations/auth.js";
import {validationResult} from "express-validator";
import UserModel from "./models/User.js";
import bcrypt from "bcrypt";

mongoose.connect('mongodb://127.0.0.1:27020/blog-mern')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

const app = express();
app.use(express.json());
app.get('/', (req, res) => {
    res.send('index.htmlassad');
})

app.listen(8008, (error) => {
    if (error) {
        console.error(error);
    }
    console.log(`Server running on port 8008`);
})


app.post('/auth/register', registerValidator, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        const doc = new UserModel({
            fullName: req.body.fullName,
            email: req.body.email,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash
        });
        const user = await doc.save();
        const token = jwt.sign({
                _id: user._id,
            },
            'secret123',
            {expiresIn: '30d'}
        );
        const {passwordHash, ...userData} = user._doc;
        res.json({
            ...userData,
            token: token,
        });
    } catch (e) {
        res.status(500).json({error: e});
    }
})

app.post('/login', async (req, res) => {
    try {
        const user = await UserModel.findOne({email: req.body.email});
        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }
        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);
        if (!isValidPass) {
            return res.status(401).json({message: 'Invalid password'});
        }
        const token = jwt.sign({
                _id: user._id,
            },
            'secret123',
            {expiresIn: '30d'}
        );
        const {passwordHash, ...userData} = user._doc;
        res.json({
            ...userData,
            token: token,
        });
    } catch (e) {

    }
})