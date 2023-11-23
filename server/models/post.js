const db = require("../db/db.js");
const jwt = require("jsonwebtoken");
const user = require("../models/user.js");

class Post {
    async getAll(token) {
        if (token == ":token")
            return db.getAllPosts(false);

        if (await user.isAdmin(token))
            return db.getAllPosts(true);
        else
            return db.getAllPosts(false);
    }

    async getPost(id, token) {
        return db.getPost(id);
    }

    async getPost(id, token) {
        if (token == ":token")
            return db.getPost(id, false);

        if (await user.isAdmin(token))
            return db.getPost(id, true);
        else
            return db.getPost(id, false);
    }

    async getPostsByAuthor(id, token) {
        if (token == ":token")
            return db.getPostsByAuthor(id, false);

        if (await user.isAdmin(token))
            return db.getPostsByAuthor(id, true);
        else
            return db.getPostsByAuthor(id, false);
    }

    async getAllComments(postId) {
        return db.getAllComments(postId);
    }

    async createComment(postId, token, content) {
        const tokenVerify = jwt.verify(token, process.env.TOKEN_SECRET);
        return db.createComment(postId, tokenVerify.id, content);
    }

    async getPostCategories(postId) {
        return db.getPostCategories(postId);
    }

    async getUserInfo(token, postId) {
        if (token !== ":token") {
            const tokenVerify = jwt.verify(token, process.env.TOKEN_SECRET);
            return db.getUserInfo(tokenVerify.id, postId);
        }
        else
            return {
                isAuthor: false,
                isAdmin: false
            }
    }

    async getPostLikes(postId, token) {
        let tokenVerify = "not authorized";
        if (token !== ":token") {
            tokenVerify = jwt.verify(token, process.env.TOKEN_SECRET);
            return db.getPostLikes(tokenVerify.id, postId);
        }
        else
            return db.getPostLikes(tokenVerify, postId);
    }

    async createPost(token, title, content, categories) {
        const tokenVerify = jwt.verify(token, process.env.TOKEN_SECRET);
        await db.createPost(tokenVerify.id, title, content, categories);
    }

    async newPostLike(token, postId, isLike) {
        const tokenVerify = jwt.verify(token, process.env.TOKEN_SECRET);
        await db.newPostLike(tokenVerify.id, postId, isLike);
    }

    async updatePost(token, postId, title, content, categories) {
        const tokenVerify = jwt.verify(token, process.env.TOKEN_SECRET);
        await db.updatePost(tokenVerify.id, postId, title, content, categories);
    }

    async banPost(id, token) {
        if (await user.isAdmin(token))
            await db.banPost(id);
        else
            throw new Error("Acces denied");
    }

    async deletePost(postId, token) {
        const tokenVerify = jwt.verify(token, process.env.TOKEN_SECRET);
        await db.deletePost(postId, tokenVerify.id);
    }
}

module.exports = new Post();