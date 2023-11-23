const db = require("../db/db.js");
const user = require("../models/user.js");

class Categories {
    async getAllCategories() {
        return await db.getAllCategories();
    }

    async getSpecifiedCategory(id) {
        const result = await db.getSpecifiedCategory(id);
        if (result.length == 0) {
            throw new Error("This category does not exist");
        }
        else return result;
    }

    async getPostsByCategory(id) {
        if (!(await db.doesCategoryExist("id", id))) {
            throw new Error("This category does not exist");
        }

        return await db.getPostsByCategory(id);
    }

    async newCategory(title, description, token) {
        if (!(await user.isAdmin(token)))
            throw new Error("Acces denied");

        if ((await db.doesCategoryExist("title", title))) {
            throw new Error("This category already exists");
        }

        await db.newCategory(title, description);
    }

    async updateCategory(id, title, description, token) {
        if (!(await user.isAdmin(token)))
            throw new Error("Acces denied");

        if (!(await db.doesCategoryExist("id", id))) {
            throw new Error("This category does not exist");
        }
        if ((await db.doesCategoryExistForUpdate("title", title, id))) {
            throw new Error("This title is taken");
        }

        await db.updateCategory(id, title, description);
    }

    async deleteCategory(id, token) {
        if (!(await user.isAdmin(token)))
            throw new Error("Acces denied");

        if (!(await db.doesCategoryExist("id", id))) {
            throw new Error("This category does not exist");
        }

        return await db.deleteCategory(id);
    }
}

module.exports = new Categories();