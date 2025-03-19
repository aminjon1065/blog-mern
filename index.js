import express from 'express';
import mongoose from "mongoose";
import {loginValidator, registerValidator} from "./validations/auth.js";
import checkAuth from "./utils/middleware.js";
import {getMe, login, register} from "./controllers/UserController.js";
import {createPost, deletePost, getAllPosts, getOnePost, updatePost} from "./controllers/PostController.js";
import {postCreateValidation} from "./validations/post.js";
import multer from "multer";
import handleValidationErrors from "./utils/handleValidationErrors.js";

mongoose.connect('mongodb://127.0.0.1:27020/blog-mern')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

const app = express();
const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, `uploads`);
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    }
})
const upload = multer({storage});
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.get('/', (req, res) => {
    res.send('index.htmlassad');
})
app.post('/uploads', checkAuth, upload.single("image"), (req, res) => {
    res.json({
        url: `/uploads/${req.file.filename}`,
    })
})
app.listen(8008, (error) => {
    if (error) {
        console.error(error);
    }
    console.log(`Server running on port 8008`);
})
app.post('/auth/register', registerValidator, handleValidationErrors, register);
app.post('/auth/login', loginValidator, handleValidationErrors, login)
app.get('/auth/me', checkAuth, getMe)

app.get('/post', getAllPosts);
app.get('/post/:id', getOnePost);
app.post('/post', checkAuth, postCreateValidation, handleValidationErrors, createPost)
app.delete('/post/:id', checkAuth, deletePost)
app.patch('/post/:id', checkAuth, postCreateValidation, handleValidationErrors, updatePost)
