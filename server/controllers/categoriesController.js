const categories = require("../models/categories.js");

class CategoriesController {
    async getAllCategories(req, res) {
        try {
            const result = await categories.getAllCategories();
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

    async getSpecifiedCategory(req, res) {
        try {
            const result = await categories.getSpecifiedCategory(req.params.id)
            const jsonContent = JSON.stringify(result);
            res.end(jsonContent);
        }
        catch (e) {
            res.status(400);
            // if (e.message == "jwt malformed")
            //     res.send("You're not authorised");
            res.send(e.message);
        }
    }

    async getPostsByCategory(req, res) {
        try {
            const result = await categories.getPostsByCategory(req.params.id);
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

    async newCategory(req, res) {
        const { title, description } = req.body;
        try {
            await categories.newCategory(title, description, req.params.token);
            res.status(200).send("Category created");
        }
        catch (e) {
            res.status(400);
            if (e.message == "jwt malformed")
                res.send("You're not authorised");
            res.send(e.message);
        }
    }

    async updateCategory(req, res) {
        const { title, description } = req.body;
        try {
            await categories.updateCategory(req.params.id, title, description, req.params.token);
            res.status(200).send("Category updated");
        }
        catch (e) {
            res.status(400);
            if (e.message == "jwt malformed")
                res.send("You're not authorised");
            res.send(e.message);
        }
    }

    async deleteCategory(req, res) {
        try {
            await categories.deleteCategory(req.params.id, req.params.token);
            res.status(200).send("Category deleted");
        }
        catch (e) {
            res.status(400);
            if (e.message == "jwt malformed")
                res.send("You're not authorised");
            res.send(e.message);
        }
    }
}

module.exports = new CategoriesController();