import PostModel from "../models/PostModel.js";


export const getAllPosts = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').exec();
        res.status(200).json(posts)
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: e.message,
        })
    }
}

export const getOnePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const doc = await PostModel.findOneAndUpdate(
            {_id: postId},
            {$inc: {viewsCount: 1}},
            {returnDocument: 'after'}
        );
        if (!doc) {
            return res.status(404).json({message: 'Post not found'});
        }
        res.status(200).json(doc);
    } catch (e) {
        console.error("Error:", e);
        res.status(500).json({message: e.message});
    }
};
export const createPost = async (req, res) => {
    try {
        const doc = await PostModel({
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags,
            imageUrl: req.body.imageUrl,
            user: req.userId,
        })
        const post = await doc.save();
        return res.status(201).json(post);
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            message: e.message,
        })
    }
}

export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const doc = await PostModel.findOneAndDelete({_id: postId});
        if (!doc) {
            return res.status(404).json({message: 'Post not found'});
        }
        res.status(200).json({
            message: 'Post deleted successfully',
        });
    } catch (e) {
        console.error("Error:", e);
        res.status(500).json({message: e.message});
    }
}

export const updatePost = async (req, res) => {
    try {
        const postId = req.params.id;
        await PostModel.updateOne(
            {_id: postId},
            {
                title: req.body.title,
                text: req.body.text,
                tags: req.body.tags,
                imageUrl: req.body.imageUrl,
                user: req.userId,
            }
        )
        res.status(200).json({
            message: 'Post updated successfully',
        });
    } catch (e) {
        res.status(500).json({message: e.message});
    }
}