const db = require("../db/db.js");
const jwt = require("jsonwebtoken");

class Comments {
    async getSpecifiedComment(id) {
        const result = await db.getSpecifiedComment(id);
        if (result.length == 0) {
            throw new Error("This comment does not exist");
        }
        else return result;
    }

    async getCommentLikes(commentId, token) {
        let tokenVerify = "not authorized";
        if (token !== ":token") {
            tokenVerify = jwt.verify(token, process.env.TOKEN_SECRET);
            return db.getCommentLikes(tokenVerify.id, commentId);
        }
        else return db.getCommentLikes(tokenVerify, commentId);
        // if (!(await db.doesCommentExist("id", id))) {
        //     throw new Error("This comment does not exist");
        // }

        // return (await db.getCommentLikes(id)).length;
    }

    async newCommentLike(commentId, token, isLike) {
        if (!(await db.doesCommentExist("id", commentId))) {
            throw new Error("This comment does not exist");
        }

        const tokenVerify = jwt.verify(token, process.env.TOKEN_SECRET);
        await db.newCommentLike(commentId, tokenVerify.id, isLike);
    }

    async getUserInfo(token, comId) {
        if (token !== ":token") {
            const tokenVerify = jwt.verify(token, process.env.TOKEN_SECRET);
            return db.getUserInfoForComment(tokenVerify.id, comId);
        }
        else
            return {
                isAuthor: false,
                isAdmin: false
            }
    }

    async updateComment(commentId, token, content) {
        if (!(await db.doesCommentExist("id", commentId))) {
            throw new Error("This comment does not exist");
        }

        const tokenVerify = jwt.verify(token, process.env.TOKEN_SECRET);
        await db.updateComment(commentId, tokenVerify.id, content);
    }

    async deleteComment(commentId, token) {
        const tokenVerify = jwt.verify(token, process.env.TOKEN_SECRET);

        if (!(await db.doesCommentExist("id", commentId))) {
            throw new Error("This comment does not exist");
        }

        await db.deleteComment(commentId, tokenVerify.id);
    }
}

module.exports = new Comments();