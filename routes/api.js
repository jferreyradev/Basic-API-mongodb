const express = require('express');
const router = express.Router();
const { getUsers, newUser, delUser, userValidator, loginValidator, editUser, login, logout } = require('../controller/user.js');
const auth = require('../middleware/auth');

router.get('/user/view', auth, getUsers);

router.post('/user/new', userValidator, newUser);

router.delete('/user/delete', auth, loginValidator, delUser);

router.put('/user/edit', auth, loginValidator, editUser);

router.post('/user/login', loginValidator, login);

router.post('/user/logout', auth, logout);

module.exports = router;