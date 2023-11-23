const post = require("../models/post.js");

class PostController {
    async getPosts(req, res) {
        const { token } = req.params;
        try {
            const result = await post.getAll(token);

            return res.json(result)
        }
        catch (e) {
            res.status(400);
            if (e.message == "jwt malformed")
                res.send("You're not authorised");
            else
                res.send(e.message);
        }
    }

    async getSpecifiedPost(req, res) {
        const { id, token } = req.params;
        try {
            const result = await post.getPost(id, token);

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

    async getPostsByAuthor(req, res) {
        const { id, token } = req.params;
        try {
            const result = await post.getPostsByAuthor(id, token);

            const jsonContent = JSON.stringify(result);
            res.end(jsonContent);
        }
        catch (e) {
            res.status(400);
            res.send(e.message);
        }
    }

    async getAllComments(req, res) {
        try {
            const result = await post.getAllComments(req.params.id);

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

    async createComment(req, res) {
        const { id, token } = req.params;
        try {
            await post.createComment(id, token, req.body.content);
            res.status(200).send("Comment posted");
        }
        catch (e) {
            res.status(400);
            if (e.message == "jwt malformed")
                res.send("You're not authorised");
            else
                res.send(e.message);
        }
    }

    async getPostCategories(req, res) {
        try {
            const result = await post.getPostCategories(req.params.id);

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

    async getUserInfo(req, res) {
        const { id, token } = req.params;
        try {
            const result = await post.getUserInfo(token, id);

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

    async getPostLikes(req, res) {
        const { id, token } = req.params;
        try {
            const result = await post.getPostLikes(id, token);

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

    async createPost(req, res) {
        const { title, content, categories } = req.body;
        try {
            await post.createPost(req.params.token, title, content, categories);
            res.status(200).send("Post created");
        }
        catch (e) {
            res.status(400);
            if (e.message == "jwt malformed")
                res.send("You're not authorised");
            else
                res.send(e.message);
        }
    }

    async newPostLike(req, res) {
        const { token, id } = req.params;
        try {
            await post.newPostLike(token, id, req.body.isLike);
            res.status(200).send("Rating changed");
        }
        catch (e) {
            res.status(400);
            if (e.message == "jwt malformed")
                res.send("You're not authorised");
            else
                res.send(e.message);
        }
    }

    async updatePost(req, res) {
        const { title, content, categories } = req.body;
        const { token, id } = req.params;
        try {
            await post.updatePost(token, id, title, content, categories);
            res.status(200).send("Post updated");
        }
        catch (e) {
            res.status(400);
            if (e.message == "jwt malformed")
                res.send("You're not authorised");
            else
                res.send(e.message);
        }
    }

    async banPost(req, res) {
        const { token, id } = req.params;
        try {
            await post.banPost(id, token);
            res.status(200).send("Post banned");
        }
        catch (e) {
            res.status(400);
            if (e.message == "jwt malformed")
                res.send("You're not authorised");
            else
                res.send(e.message);
        }
    }

    async deletePost(req, res) {
        const { id, token } = req.params;
        try {
            await post.deletePost(id, token);
            res.status(200).send("Post deleted");
        }
        catch (e) {
            res.status(400);
            if (e.message == "jwt malformed")
                res.send("You're not authorised");
            else
                res.send(e.message);
        }
    }
}

module.exports = new PostController();