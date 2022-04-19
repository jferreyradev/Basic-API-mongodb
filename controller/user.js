const { User } = require('../models/user')
const { validationResult, check, body } = require('express-validator');
const bcrypt = require('bcrypt');

const getUsers = async (req, res) => {
    const users = await User.find()
    res.json({ users })
}

const getUser = async (email, password) => {
    const user = await User.findOne({ email: email });
    try {
        return await comparePws(password, user.password) ? user : null;
    } catch (error) {
        return null;
    }
}

const getHash = (plain, salt = 10) => bcrypt.hashSync(plain, salt);
const comparePws = (plain, hash) => bcrypt.compare(plain, hash);

const userValidator = [
    check('firstName').not().isEmpty(),
    check('lastName').not().isEmpty(),
    check('email').isEmail(),
    check('password').isLength({ min: 5 })
];

const loginValidator = [
    check('email')
        .not().isEmpty().withMessage('Username is required')
        .isEmail().withMessage('username must be an email'),
    check('password')
        .not().isEmpty().withMessage('password is required')
];

const newUser = async (req, res) => {
    const errors = validationResult(req);
    const email = req.body.email;
    let user;

    if (email) {
        user = await User.findOne({ email: email })
    }

    if (user) {
        return res.status(400).json({ errors: user.username + ' user already exists' });
    }

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors });
    }

    try {
        const user = new User({
            userName: req.body.username,
            email: req.body.email,
            password: getHash(req.body.password),
            firstName: req.body.firstName,
            lastName: req.body.lastName
        });
        user.save();
        res.status(200).json({ msg: 'user created', data: user })
    } catch (error) {
        return res.status(400).json({ errors: error });
    }
}

const delUser = async (req, res) => {
    const user = req.session.user;
    if (user) {
        try {
            await User.deleteOne({ _id: user._id });
            req.session.destroy();
            return res.status(200).json({
                ok: true,
                msg: 'user deleted'
            });
        } catch (error) {
            return res.status(400).json({ errors: error });
        }
    } else {
        res.status(400).json({ msg: 'invalid email or password' });
    }
}

const editUser = async (req, res) => {
    const user = req.session.user;
    if (user) {
        if (req.body.password) {
            req.body.password = await getHash(req.body.password);
            req.session.destroy();
        }
        User.updateOne({ _id: user._id }, req.body, (err, userBD) => {
            if (err) {
                res.status(400).json({
                    ok: false, err
                });
            }
            if (!userBD) {
                res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Usuario no encontrado'
                    }
                });
            }
            res.json({
                ok: true,
                userBD
            });
        });
    } else {
        return res.status(400).json({ msg: 'invalid email or password' });
    }

}

const login = async (req, res) => {
    if (req.session.user) {
        return res.status(200).json({ msg: 'login already exists. Logout and retry' });
    } else {
        const user = await getUser(req.body.email, req.body.password);
        if (user) {
            req.session.user = user;
            return res.status(200).json({ loggin: true, session: req.session.user });
        } else {
            return res.status(400).json({ msg: 'invalid email or password' });
        }
    }
}

const logout = async (req, res) => {
    req.session.destroy();
    res.status(200).json({ loggin: false, session: 'destroyed' });
}

module.exports = { getUsers, newUser, delUser, editUser, login, logout, userValidator, loginValidator }