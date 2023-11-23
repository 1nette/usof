const user = require("../models/user.js");
const bcrypt = require("bcrypt");

class UserController {
    async test(req, res) {
        console.log(await bcrypt.hash('dsfbsfsvsd', 3))
    }

    async userRegistration(req, res) {
        const { login, password, email } = req.body;

        try {
            await user.new(login, password, email, 'user');
            res.status(200).send("Registered successfully");
        }
        catch (e) {
            res.status(400);
            if (e.message == "jwt malformed")
                res.send("You're not authorised");
            res.send(e.message);
        }
    }

    async confirmEmail(req, res) {
        try {
            await user.confirmEmail(req.params.token);
        } catch (e) {
            res.status(400);
            if (e.message == "jwt malformed")
                res.send("You're not authorised");
            res.send(e.message);
        }

        return res.status(200).send("Email confirmed");
    }

    async resetPass(req, res) {
        try {
            const result = await user.resetPass(req.body.email);
            res.status(200).send("Confirmation email sent");
        }
        catch (e) {
            res.status(400);
            if (e.message == "jwt malformed")
                res.send("You're not authorised");
            res.send(e.message);
        }
    }

    async resetPassConfirm(req, res) {
        try {
            await user.confirmReset(req.params.token, req.body.newPass);
            res.status(200).send("New password confirmed");
        } catch (e) {
            res.status(400);
            if (e.message == "jwt malformed")
                res.send("You're not authorised");
            res.send(e.message);
        }
    }

    async login(req, res) {
        const { login, password, email } = req.body;
        try {
            const token = await user.login(login, email, password);
            res.status(200).send(token);
        }
        catch (e) {
            res.status(400);
            if (e.message == "jwt malformed")
                res.send("You're not authorised");
            res.send(e.message);
        }
    }

    async logout(req, res) {
        await user.logout(req.params.token);
        res.status(200).send("Logged out");
    }

    async getUsers(req, res) {
        try {
            const result = await user.getAll();
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

    async getSpecifiedUser(req, res) {
        const { id } = req.params;
        try {
            const userInfo = await user.getById(id);
            const jsonContent = JSON.stringify(userInfo);
            res.end(jsonContent);
        }
        catch (e) {
            res.status(400);
            if (e.message == "jwt malformed")
                res.send("You're not authorised");
            res.send(e.message);
        }
    }

    async getCurrentUser(req, res) {
        const { token } = req.params;
        try {
            const userInfo = await user.getCurrentUser(token);
            const jsonContent = JSON.stringify(userInfo);
            res.end(jsonContent);
        }
        catch (e) {
            res.status(400);
            if (e.message == "jwt malformed")
                res.send("You're not authorised");
            res.send(e.message);
        }
    }

    async getIsAdmin(req, res) {
        const { token } = req.params;
        try {
            const userInfo = await user.getIsAdmin(token);
            const jsonContent = JSON.stringify(userInfo);
            res.end(jsonContent);
        }
        catch (e) {
            res.status(400);
            if (e.message == "jwt malformed")
                res.send("You're not authorised");
            res.send(e.message);
        }
    }

    async getUserRating(req, res) {
        try {
            const userRating = await user.getUserRating(req.params.id);
            const jsonContent = JSON.stringify(userRating);
            res.end(jsonContent);
        }
        catch (e) {
            res.status(400);
            res.send(e.message);
        }
    }

    async createUser(req, res) {
        if (!(await user.isAdmin(req.params.token))) {
            res.status(403).send("Access denied");
        }
        const { login, password, email, role } = req.body;
        try {
            const result = await user.new(login, password, email, role);
            res.status(200).send("Registered seccessfully");
        }
        catch (e) {
            res.status(400);
            if (e.message == "jwt malformed")
                res.send("You're not authorised");
            res.send(e.message);
        }
    }

    async deleteUser(req, res) {
        const { id, token } = req.params;
        try {
            await user.delete(id, token);
            res.status(200).send("User deleted");
        }
        catch (e) {
            res.status(400);
            if (e.message == "jwt malformed")
                res.send("You're not authorised");
            res.send(e.message);
        }
    }

    async uploadAvatar(req, res) {
        res.status(200);
        await user.uploadAvatar(req.params.token, req.file.path);
        res.json({
            massage: 'new avatar uploaded',
            file: req.file.path,
        });
    }

    async getUserForUpdate(req, res) {
        const { token } = req.params;
        try {
            const userInfo = await user.getUserForUpdate(token);
            const jsonContent = JSON.stringify(userInfo);
            res.end(jsonContent);
        }
        catch (e) {
            res.status(400);
            if (e.message == "jwt malformed")
                res.send("You're not authorised");
            res.send(e.message);
        }
    }

    async updateUser(req, res) {
        const { login, full_name, email } = req.body;
        const { token } = req.params;
        try {
            await user.update(token, login, full_name, email);
            res.status(200).send("Updated successfully");
        }
        catch (e) {
            res.status(400);
            if (e.message == "jwt malformed")
                res.send("You're not authorised");
            res.send(e.message);
        }
    }

    async confirmNewEmail(req, res) {
        try {
            await user.confirmNewEmail(req.params.token);
            return res.status(200).send("OK");
        } catch (e) {
            res.status(400);
            if (e.message == "jwt malformed")
                res.send("You're not authorised");
            res.send(e.message);
        }
    }
}

module.exports = new UserController();