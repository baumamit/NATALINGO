// https://www.youtube.com/watch?v=_EP2qCmLzSE&list=PL55RiY5tL51q4D-B63KBnygU6opNPFk_q&index=11
const express = require('express');
const router = express.Router();

const UserController = require('../controllers/user');
const checkAuth = require('../middleware/check-auth');

router.post('/register', UserController.user_register);

router.post('/login', UserController.user_login);

router.delete('/:userId', checkAuth, UserController.user_delete);

module.exports = router;