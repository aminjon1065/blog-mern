import bcrypt from "bcrypt";
import UserModel from "../models/UserModel.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {

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
}

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({email: req.body.email});
        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }
        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);
        if (!isValidPass) {
            return res.status(400).json({message: 'Неверный логин или пароль'});
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
        res.status(500).json({error: e});
    }
}

export const getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId)
        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }
        const {passwordHash, ...userData} = user._doc;
        res.json(userData);
    } catch (e) {
        console.log(e)
        res.status(500).json({error: e});
    }
}