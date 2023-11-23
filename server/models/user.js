const db = require("../db/db.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASSWORD,
    },
});

class User {
    async test() {

    }

    ////////////////////////////////////////////////////// AUTH //////////////////////////////////////////////////////

    async new(login, pass, email, role) {
        if (await db.doesUserExist('login', login))
            throw new Error("This login is taken");
        if (await db.doesUserExist('email', email))
            throw new Error("This email is taken");
        if (!email.includes("@"))
            throw new Error("Email is not valid");

        const hashedPass = await bcrypt.hash(pass, 3);
        await db.createUser(login, hashedPass, email, role);
        const id = await db.getUserIdByLogin(login);
        await this.#sendConfirmToken(id, email, "auth/confirmation");
    }

    async #sendConfirmToken(id, email, reqUrl) {
        jwt.sign(
            {
                id,
                email,
            },
            process.env.TOKEN_SECRET,
            {
                expiresIn: '1d',
            },
            (err, emailToken) => {
                const url = `http://localhost:5000/api/${reqUrl}/${emailToken}`;

                transporter.sendMail({
                    to: email,
                    subject: 'Confirm Email',
                    html: `Please click this email to confirm your email: <a href="${url}">${url}</a>`,
                });
            },
        );
    }

    async confirmEmail(token) {
        const tokenVerify = jwt.verify(token, process.env.TOKEN_SECRET);
        await db.setUserConfirmed(tokenVerify.id);
    }

    async #sendResetToken(email) {
        jwt.sign(
            {
                email,
            },
            process.env.TOKEN_SECRET,
            {
                expiresIn: '1d',
            },
            (err, emailToken) => {
                const url = `http://localhost:3000/confirm_password/${emailToken}`;

                transporter.sendMail({
                    to: email,
                    subject: 'Reset Password',
                    html: `Please click this email to reset your password: <a href="${url}">${url}</a>`,
                });
            },
        );
    }

    async resetPass(email) {
        if (await db.doesUserExist('email', email)) {
            this.#sendResetToken(email);
        }
        else
            throw new Error("User with this email does not exist");
    }

    async confirmReset(token, pass) {
        const tokenVerify = jwt.verify(token, process.env.TOKEN_SECRET);
        const hashedPass = await bcrypt.hash(pass, 3);
        await db.setNewUserPassword(hashedPass, tokenVerify.email)
    }

    async login(login, email, pass) {
        if (await db.doesUserExist('email', email) && await db.compareUserPassword(login, pass)) {
            const queryResult = await db.isUserConfirmed(login);
            if ((await queryResult).is_confirmed == 0) {
                this.#sendConfirmToken((await queryResult).id, email, "auth/confirmation");
                throw new Error("Email is not confirmed. Sent new confirmation email");
            }

            const result = this.#createLoginToken(login);
            return result;
        }
        else {
            throw new Error("Information entered incorrectly");
        }
    }

    async #createLoginToken(login) {
        const id = await db.getUserIdByLogin(login);
        const token = jwt.sign({ id }, process.env.TOKEN_SECRET, { expiresIn: '30d', });
        await db.saveLoginToken(id, token);
        return token;
    }

    async logout(token) {
        const tokenVerify = jwt.verify(token, process.env.TOKEN_SECRET);
        await db.deleteToken(tokenVerify.id);
    }
    ////////////////////////////////////////////////////// AUTH //////////////////////////////////////////////////////

    ////////////////////////////////////////////////////// USERS //////////////////////////////////////////////////////
    async getAll() {
        return db.getAllUsers();
    }

    async getById(id) {
        return await db.getUserById(id);
    }

    async getCurrentUser(token) {
        if (token !== ':token') {
            const tokenVerify = jwt.verify(token, process.env.TOKEN_SECRET);
            return await db.getUserById(tokenVerify.id);
        }
        else {
            return []
        }
    }

    async getIsAdmin(token) {
        if (token !== ':token')
            return this.isAdmin(token);
        else
            return false;
    }

    async getUserRating(id) {
        return await db.getUserRating(id);
    }

    async isAdmin(token) {
        const tokenVerify = jwt.verify(token, process.env.TOKEN_SECRET);
        const queryResult = await db.getUserRoleById(tokenVerify.id);

        if (queryResult.title == "admin")
            return true;
        else
            return false;
    }

    async delete(id, token) {
        if (await this.isAdmin(token))
            await db.deleteUser(id);
        else
            throw new Error("Access denied");
    }

    async uploadAvatar(token, path) {
        const tokenVerify = jwt.verify(token, process.env.TOKEN_SECRET);
        db.updateAvatar(path, tokenVerify.id);
    }

    async getUserForUpdate(token) {
        if (token !== ':token') {
            const tokenVerify = jwt.verify(token, process.env.TOKEN_SECRET);
            return db.getUserForUpdate(tokenVerify.id);
        }
    }

    async update(token, login, full_name, email) {
        const tokenVerify = jwt.verify(token, process.env.TOKEN_SECRET);
        
        if (!db.doesUserExistForUpdate('email', email, tokenVerify.id))
            throw new Error("Email is already taken");
        if (!db.doesUserExistForUpdate('login', login, tokenVerify.id))
            throw new Error("Login is already taken");

        db.updateUser(tokenVerify.id, login, full_name);
        this.#sendConfirmToken(tokenVerify.id, email, "users/confirmation");
    }

    async confirmNewEmail(token) {
        const tokenVerify = jwt.verify(token, process.env.TOKEN_SECRET);
        db.updateUserEmail(tokenVerify.email, tokenVerify.id)
    }
    ////////////////////////////////////////////////////// USERS //////////////////////////////////////////////////////
}

module.exports = new User();