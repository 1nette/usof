const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");

class DB {
    #conn;

    constructor() {
        this.#conn = mysql.createConnection({
            host: 'localhost',
            database: 'usof',
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD
        })
    }

    async executeQuery(sqlString) {
        const result = (await this.#conn).execute(sqlString);
        return ((await result)[0]);
    }

    ////////////////////////////////////////////////////// USER //////////////////////////////////////////////////////

    async doesUserExist(column, data) {
        const queryResult = await this.executeQuery(`SELECT 1 FROM user WHERE ${column} = '${data}'`);
        if (await queryResult.length == 0)
            return false;
        else
            return true;
    }

    async doesUserExistForUpdate(column, data, userId) {
        const queryResult = await this.executeQuery(`SELECT * FROM user WHERE ${column} = '${data}' AND id != ${userId}`);

        if (await queryResult.length == 0)
            return false;
        else
            return true;
    }

    async compareUserPassword(login, pass) {
        const queryResult = await this.executeQuery(`SELECT password FROM user WHERE login = '${login}'`);
        if (queryResult.length == 0)
            throw new Error("Information entered incorrectly");
        const hashedPass = (await queryResult)[0].password;
        return (await bcrypt.compare(pass, hashedPass));
    }

    async createUser(login, pass, email, role) {
        await this.executeQuery(`INSERT INTO user (login, password, full_name, email, role_id, is_confirmed) VALUES ('${login}', '${pass}', 'John Doe', '${email}', (SELECT id FROM role WHERE title = '${role}'), 0)`);
    }

    async getUserIdByLogin(login) {
        const queryResult = await this.executeQuery(`SELECT id FROM user WHERE login = '${login}'`);
        return ((await queryResult)[0].id)
    }

    async setUserConfirmed(id) {
        await this.executeQuery(`UPDATE user SET is_confirmed = 1 WHERE id = ${id}`)
    }

    async setNewUserPassword(pass, email) {
        await this.executeQuery(`UPDATE user SET password = '${pass}' WHERE email = '${email}'`)
    }

    async isUserConfirmed(login) {
        return (await this.executeQuery(`SELECT is_confirmed, id FROM user WHERE login = '${login}'`))[0];
    }

    async saveLoginToken(id, token) {
        await this.executeQuery(`UPDATE user SET token = '${token}' WHERE id = ${id}`);
    }

    async getAllUsers() {
        return await this.executeQuery(`SELECT id, full_name, login, profile_pic, rating FROM user`);
    }

    async getUserById(id) {
        const result = (await this.executeQuery(`SELECT id, full_name, login, profile_pic, rating, role_id FROM user WHERE id = ${id}`))[0];
        if (result.length == 0)
            throw new Error("This user does not exist");
        else
            return result;
    }

    async getUserRating(userId) {
        if (!(await this.doesUserExist("id", userId)))
            throw new Error("This user does not exist");
        return (await this.executeQuery(`SELECT rating FROM user WHERE id = ${userId}`))[0];
    }

    async getUserRoleById(id) {
        return (await this.executeQuery(`SELECT title FROM role WHERE id = (SELECT role_id FROM user WHERE id = ${id})`))[0];
    }

    async deleteUser(id) {
        if (!(await this.doesUserExist("id", id)))
            throw new Error("This user does not exist");

        const login = "deleted_user" + id;
        const name = "Deleted User";
        await this.executeQuery(`UPDATE usof.user SET login = '${login}', password = 'deleted', full_name = '${name}', email = 'deleted', profile_pic = 'default.png', token = NULL, role_id = 0 WHERE id = ${id}`);
    }

    async updateAvatar(path, id) {
        await this.executeQuery(`UPDATE user SET profile_pic = '${path}' WHERE id = ${id}`);
    }

    async getUserForUpdate(userId) {
        return await this.executeQuery(`SELECT login, email, full_name FROM user WHERE id = ${userId}`);
    }

    async updateUser(userId, login, full_name) {
        await this.executeQuery(`UPDATE user SET login = '${login}', full_name = '${full_name}' WHERE id = ${userId}`);
    }

    async updateUserEmail(email, id) {
        await this.executeQuery(`UPDATE user SET email = '${email}' WHERE id = ${id}`);
    }

    async deleteToken(id) {
        await this.executeQuery(`UPDATE user SET token = NULL WHERE id = ${id}`);
    }

    ////////////////////////////////////////////////////// USER //////////////////////////////////////////////////////

    ////////////////////////////////////////////////////// POST //////////////////////////////////////////////////////

    async doesPostExist(id) {
        const queryResult = await this.executeQuery(`SELECT 1 FROM post WHERE id = ${id}`);
        if (await queryResult.length == 0)
            return false;
        else
            return true;
    }

    async getAllPosts(isAdmin) {
        if (isAdmin)
            return await this.executeQuery(`SELECT post.id, user.full_name, post.title, post.is_active, post.content, post.publish_date, post.categories, post.likes FROM post INNER JOIN user ON post.author_id = user.id ORDER BY publish_date DESC`);
        else
            return await this.executeQuery(`SELECT post.id, user.full_name, post.title, post.content, post.publish_date, post.categories, post.likes FROM post INNER JOIN user ON post.author_id = user.id WHERE post.is_active = 1 ORDER BY publish_date DESC`);
    }

    async getPost(id) {
        const queryResult = await this.executeQuery(`SELECT post.id, user.full_name, user.login, post.author_id, post.title, post.publish_date, post.is_active, post.content FROM post INNER JOIN user ON post.author_id = user.id  WHERE post.id = ${id}`);
        if (queryResult.length == 0)
            throw new Error("This post does not exist");

        return queryResult;
    }

    async getPostsByAuthor(id, isAdmin) {
        if (isAdmin)
            return await this.executeQuery(`SELECT post.id, user.full_name, post.title, post.is_active, post.content, post.publish_date FROM post INNER JOIN user ON post.author_id = user.id WHERE author_id = ${id}`);
        else
            return await this.executeQuery(`SELECT post.id, user.full_name, post.title, post.content, post.publish_date FROM post INNER JOIN user ON post.author_id = user.id WHERE post.author_id = ${id} AND post.is_active = 1`);
    }

    async getAllComments(postId) {
        return await this.executeQuery(`SELECT comment.id, user.full_name, user.profile_pic, user.login, comment.publish_date, comment.content FROM comment INNER JOIN user ON comment.author_id = user.id WHERE post_id = ${postId}`);
    }

    async createComment(postId, userId, content) {
        if (await this.doesPostExist(postId)) {
            await this.executeQuery(`INSERT INTO comment (author_id, publish_date, content, post_id) VALUES ((SELECT id FROM user WHERE id = ${userId}), (SELECT now()), '${content}', (SELECT id FROM post WHERE id = ${postId}))`)
        }
        else {
            throw new Error("Post does not exist");
        }
    }

    async getPostCategories(postId) {
        return await this.executeQuery(`SELECT category.title FROM category INNER JOIN postandcategory ON category.id = postandcategory.category_id WHERE postandcategory.post_id = ${postId}`);
    }

    async getUserInfo(userId, postId) {
        const res = await this.executeQuery(`SELECT id FROM post WHERE id = ${postId} AND author_id = ${userId}`);
        return {
            isAuthor: (res.length != 0),
            isAdmin: ((await this.getUserRoleById(userId)).title == 'admin')
        }
    }

    async getPostLikes(userId, postId) {
        let yourLike = 0;
        let yourDislike = 0;

        if (userId !== "not authorized") {
            yourLike = (await this.executeQuery(`SELECT id FROM usof.like WHERE entity_id = ${postId} AND is_on_post = 1 AND is_like = 1 AND author_id = ${userId}`)).length
            yourDislike = (await this.executeQuery(`SELECT id FROM usof.like WHERE entity_id = ${postId} AND is_on_post = 1 AND is_like = 0 AND author_id = ${userId}`)).length
        }

        const rating = {
            likes: (await this.executeQuery(`SELECT id FROM usof.like WHERE entity_id = ${postId} AND is_on_post = 1 AND is_like = 1`)).length,
            dislikes: (await this.executeQuery(`SELECT id FROM usof.like WHERE entity_id = ${postId} AND is_on_post = 1 AND is_like = 0`)).length,
            yourLike: yourLike,
            yourDislike: yourDislike
        }
        return rating;
    }

    async createPost(userId, title, content, categories) {
        const res = await this.executeQuery(`INSERT INTO post (author_id, title, publish_date, is_active, content, categories) VALUES ((SELECT id FROM user WHERE id = ${userId}), '${title}', (SELECT now()), 1, '${content}', '${categories}')`);

        const categoriesArray = categories.split(",");
        const postId = (await this.executeQuery(`SELECT id FROM post WHERE title = '${title}' AND content = '${content}'`))[0].id;

        for (let i = 0; i < categoriesArray.length; i++) {
            const queryResult = (await this.executeQuery(`SELECT id FROM category WHERE title = '${categoriesArray[i]}'`))[0];
            if (queryResult == undefined)
                throw new Error("Category name entered incorrectly");
            await this.executeQuery(`INSERT INTO postandcategory (post_id, category_id) VALUES ((SELECT id FROM post WHERE id = ${postId}), (SELECT id FROM category WHERE id = ${queryResult.id}))`)
        }
    }

    async newPostLike(userId, postId, isLike) {
        const currentLike = await this.executeQuery(`SELECT is_like FROM usof.like WHERE author_id = ${userId} AND is_on_post = 1 AND entity_id = ${postId}`);
        const authorId = (await this.executeQuery(`SELECT author_id FROM usof.post WHERE id = ${postId}`))[0].author_id;
        let userRating = Number((await this.executeQuery(`SELECT rating FROM user WHERE id = ${authorId}`))[0].rating);

        if (currentLike.length == 0) {
            if (isLike == 1)
                await this.executeQuery(`UPDATE user SET rating = ${userRating + 1} WHERE id = ${authorId}`);
            else
                await this.executeQuery(`UPDATE user SET rating = ${userRating - 1} WHERE id = ${authorId}`);
            await this.executeQuery(`INSERT INTO usof.like (author_id, is_on_post, entity_id, is_like) VALUES ((SELECT id FROM usof.user WHERE id = ${userId}), 1, ${postId}, ${isLike})`);
        }
        else {
            if (currentLike[0].is_like == 1)
                await this.executeQuery(`UPDATE user SET rating = ${userRating - 1} WHERE id = ${authorId}`);
            else
                await this.executeQuery(`UPDATE user SET rating = ${userRating + 1} WHERE id = ${authorId}`);
            await this.executeQuery(`DELETE FROM usof.like WHERE author_id = ${userId} AND is_on_post = 1 AND entity_id = ${postId}`);

            userRating = Number((await this.executeQuery(`SELECT rating FROM user WHERE id = ${authorId}`))[0].rating);
            if (currentLike[0].is_like != isLike) {
                await this.executeQuery(`INSERT INTO usof.like (author_id, is_on_post, entity_id, is_like) VALUES ((SELECT id FROM usof.user WHERE id = ${userId}), 1, ${postId}, ${isLike})`);
                if (isLike == 1)
                    await this.executeQuery(`UPDATE user SET rating = ${userRating + 1} WHERE id = ${authorId}`);
                else
                    await this.executeQuery(`UPDATE user SET rating = ${userRating - 1} WHERE id = ${authorId}`);
            }
        }
        const rating = await this.getPostLikes(userId, postId);
        await this.executeQuery(`UPDATE post SET likes = ${rating.likes} WHERE id = ${postId}`);
    }

    async updatePost(userId, postId, title, content, categories) {
        const check = await this.executeQuery(`SELECT id FROM post WHERE id = ${postId} AND author_id = ${userId}`);
        if (check.length == 0)
            throw new Error("This post doesn't exist anymore or you have no rights to edit it");

        await this.executeQuery(`UPDATE post SET title = '${title}', content = '${content}' WHERE id = ${postId}`);
        await this.executeQuery(`DELETE FROM postandcategory WHERE post_id = ${postId}`);

        const categoriesArray = categories.split(",");
        for (let i = 0; i < categoriesArray.length; i++) {
            const queryResult = (await this.executeQuery(`SELECT id FROM category WHERE title = '${categoriesArray[i]}'`))[0];
            if (queryResult == undefined)
                throw new Error("Category name entered incorrectly");
            else
                await this.executeQuery(`INSERT INTO postandcategory (post_id, category_id) VALUES ((SELECT id FROM post WHERE id = ${postId}), (SELECT id FROM category WHERE id = ${queryResult.id}))`)
        }
    }

    async banPost(id) {
        const res = (await this.executeQuery(`SELECT is_active FROM post WHERE id = ${id}`))[0].is_active;

        if (res == 1)
            await this.executeQuery(`UPDATE post SET is_active = 0 WHERE id = ${id}`);
        else
            await this.executeQuery(`UPDATE post SET is_active = 1 WHERE id = ${id}`);
    }

    async deletePost(postId, userId) {
        const authorId = (await this.executeQuery(`SELECT author_id FROM post WHERE id = ${postId}`))[0].author_id;
        const userRole = (await this.getUserRoleById(userId)).title;
        if (authorId == userId || userRole == "admin") {
            await this.executeQuery(`DELETE FROM postandcategory WHERE post_id = ${postId}`);
            await this.executeQuery(`DELETE FROM post WHERE id = ${postId}`);
        }
        else
            throw new Error("Acces denied");
    }

    ////////////////////////////////////////////////////// POST //////////////////////////////////////////////////////

    ////////////////////////////////////////////////////// CATEGORIES //////////////////////////////////////////////////////

    async doesCategoryExist(column, data) {
        const queryResult = await this.executeQuery(`SELECT 1 FROM category WHERE ${column} = '${data}'`);
        if (await queryResult.length == 0)
            return false;
        else
            return true;
    }

    async doesCategoryExistForUpdate(column, data, id) {
        const queryResult = await this.executeQuery(`SELECT * FROM category WHERE ${column} = '${data}' AND id != ${id}`);

        if (await queryResult.length == 0)
            return false;
        else
            return true;
    }

    async getAllCategories() {
        return await this.executeQuery(`SELECT title FROM category`);
    }

    async getSpecifiedCategory(id) {
        return await this.executeQuery(`SELECT title, description FROM category WHERE id = ${id}`);
    }

    async getPostsByCategory(id) {
        return await this.executeQuery(`SELECT post.id, post.title FROM post INNER JOIN postandcategory ON post.id = postandcategory.post_id WHERE postandcategory.category_id = ${id}`);
    }

    async newCategory(title, description) {
        return await this.executeQuery(`INSERT INTO category (title, description) VALUES ('${title}', '${description}')`);
    }

    async updateCategory(id, title, description) {
        return await this.executeQuery(`UPDATE category SET title = '${title}', description = '${description}' WHERE id = ${id}`);
    }

    async deleteCategory(id) {
        return await this.executeQuery(`DELETE FROM category WHERE id = ${id}`);
    }

    ////////////////////////////////////////////////////// CATEGORIES //////////////////////////////////////////////////////

    ////////////////////////////////////////////////////// COMMENTS //////////////////////////////////////////////////////

    async doesCommentExist(column, data) {
        const queryResult = await this.executeQuery(`SELECT 1 FROM comment WHERE ${column} = '${data}'`);
        if (await queryResult.length == 0)
            return false;
        else
            return true;
    }

    async getSpecifiedComment(id) {
        return await this.executeQuery(`SELECT user.full_name, comment.publish_date, comment.content FROM comment INNER JOIN user ON user.id = comment.author_id WHERE comment.id = ${id}`);
    }

    async getCommentLikes(userId, commentId) {
        let yourLike = 0;
        let yourDislike = 0;

        if (userId !== "not authorized") {
            yourLike = (await this.executeQuery(`SELECT id FROM usof.like WHERE entity_id = ${commentId} AND is_on_post = 0 AND is_like = 1 AND author_id = ${userId}`)).length
            yourDislike = (await this.executeQuery(`SELECT id FROM usof.like WHERE entity_id = ${commentId} AND is_on_post = 0 AND is_like = 0 AND author_id = ${userId}`)).length
        }

        const rating = {
            likes: (await this.executeQuery(`SELECT id FROM usof.like WHERE entity_id = ${commentId} AND is_on_post = 0 AND is_like = 1`)).length,
            dislikes: (await this.executeQuery(`SELECT id FROM usof.like WHERE entity_id = ${commentId} AND is_on_post = 0 AND is_like = 0`)).length,
            yourLike: yourLike,
            yourDislike: yourDislike
        }
        return rating;
        // return await this.executeQuery(`SELECT id FROM usof.like WHERE is_on_post = 0 AND entity_id = ${id}`);
    }

    async getUserInfoForComment(userId, postId) {
        const res = await this.executeQuery(`SELECT id FROM comment WHERE id = ${postId} AND author_id = ${userId}`);
        return {
            isAuthor: (res.length != 0),
            isAdmin: ((await this.getUserRoleById(userId)).title == 'admin')
        }
    }

    async newCommentLike(commentId, userId, isLike) {
        const currentLike = await this.executeQuery(`SELECT is_like FROM usof.like WHERE author_id = ${userId} AND is_on_post = 0 AND entity_id = ${commentId}`);
        const authorId = (await this.executeQuery(`SELECT author_id FROM usof.comment WHERE id = ${commentId}`))[0].author_id;
        let userRating = Number((await this.executeQuery(`SELECT rating FROM user WHERE id = ${authorId}`))[0].rating);

        if (currentLike.length == 0) {
            if (isLike == 1)
                await this.executeQuery(`UPDATE user SET rating = ${userRating + 1} WHERE id = ${authorId}`);
            else
                await this.executeQuery(`UPDATE user SET rating = ${userRating - 1} WHERE id = ${authorId}`);
            await this.executeQuery(`INSERT INTO usof.like (author_id, is_on_post, entity_id, is_like) VALUES ((SELECT id FROM usof.user WHERE id = ${userId}), 0, ${commentId}, ${isLike})`);
        }
        else {
            if (currentLike[0].is_like == 1)
                await this.executeQuery(`UPDATE user SET rating = ${userRating - 1} WHERE id = ${authorId}`);
            else
                await this.executeQuery(`UPDATE user SET rating = ${userRating + 1} WHERE id = ${authorId}`);
            await this.executeQuery(`DELETE FROM usof.like WHERE author_id = ${userId} AND is_on_post = 0 AND entity_id = ${commentId}`);

            userRating = Number((await this.executeQuery(`SELECT rating FROM user WHERE id = ${authorId}`))[0].rating);
            if (currentLike[0].is_like != isLike) {
                await this.executeQuery(`INSERT INTO usof.like (author_id, is_on_post, entity_id, is_like) VALUES ((SELECT id FROM usof.user WHERE id = ${userId}), 0, ${commentId}, ${isLike})`);
                if (isLike == 1)
                    await this.executeQuery(`UPDATE user SET rating = ${userRating + 1} WHERE id = ${authorId}`);
                else
                    await this.executeQuery(`UPDATE user SET rating = ${userRating - 1} WHERE id = ${authorId}`);
            }
        }
    }

    async updateComment(commentId, userId, content) {
        const authorId = (await this.executeQuery(`SELECT author_id FROM comment WHERE id = ${commentId}`))[0].author_id;
        if (authorId == userId)
            await this.executeQuery(`UPDATE comment SET content = '${content}' WHERE id = ${commentId}`);
        else
            throw new Error("Access denied");
    }

    async deleteComment(commentId, userId) {
        const authorId = (await this.executeQuery(`SELECT author_id FROM comment WHERE id = ${commentId}`))[0].author_id;
        const userRole = (await this.getUserRoleById(userId)).title;
        if (authorId == userId || userRole == "admin") {
            await this.executeQuery(`DELETE FROM usof.like WHERE is_on_post = 0 AND entity_id = ${commentId}`);
            await this.executeQuery(`DELETE FROM comment WHERE id = ${commentId}`);
        }
        else
            throw new Error("Acces denied");
    }

    ////////////////////////////////////////////////////// COMMENTS //////////////////////////////////////////////////////
}

module.exports = new DB();