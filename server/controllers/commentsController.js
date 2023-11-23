const comments = require("../models/comments.js");

class CommentsController {
    async getSpecifiedComment(req, res) {
        try {
            const result = await comments.getSpecifiedComment(req.params.id);
            const jsonContent = JSON.stringify(result);
            res.end(jsonContent);
        }
        catch (e) {
            res.status(400);
            if (e.message == "jwt malformed")
                res.send("You're not authorised");
            res.send(e.message);
        }
    }

    async getUserInfo(req, res) {
        const { id, token } = req.params;
        try {
            const result = await comments.getUserInfo(token, id);

            const jsonContent = JSON.stringify(result);
            res.end(jsonContent);
        }
        catch (e) {
            res.status(400);
            if (e.message == "jwt malformed")
                res.send("You're not authorised");
            else
                res.send(e.message);
        }
    }

    async getCommentLikes(req, res) {
        const { id, token } = req.params;
        try {
            const result = await comments.getCommentLikes(id, token);

            const jsonContent = JSON.stringify(result);
            res.end(jsonContent);
        }
        catch (e) {
            res.status(400);
            if (e.message == "jwt malformed")
                res.send("You're not authorised");
            else
                res.send(e.message);
        }
        // try {
        //     const result = await comments.getCommentLikes(req.params.id);
        //     const jsonContent = JSON.stringify(result);
        //     res.end(jsonContent);
        // }
        // catch (e) {
        //     res.status(400);
        //     if (e.message == "jwt malformed")
        //         res.send("You're not authorised");
        //     res.send(e.message);
        // }
    }

    async newCommentLike(req, res) {
        const { id, token } = req.params;
        try {
            await comments.newCommentLike(id, token, req.body.isLike);
            res.status(200).send("Like posted");
        }
        catch (e) {
            res.status(400);
            if (e.message == "jwt malformed")
                res.send("You're not authorised");
            res.send(e.message);
        }
    }

    async updateComment(req, res) {
        const { id, token } = req.params;
        try {
            const result = await comments.updateComment(id, token, req.body.content);
            res.status(200).send("Comment updated");
        }
        catch (e) {
            res.status(400);
            if (e.message == "jwt malformed")
                res.send("You're not authorised");
            res.send(e.message);
        }
    }

    async deleteComment(req, res) {
        const { id, token } = req.params;
        try {
            const result = await comments.deleteComment(id, token);
            res.status(200).send("Comment deleted");
        }
        catch (e) {
            res.status(400);
            if (e.message == "jwt malformed")
                res.send("You're not authorised");
            res.send(e.message);
        }
    }
}

module.exports = new CommentsController();