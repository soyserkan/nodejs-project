const express = require('express');
const { userAuthenticated } = require('../../helpers/authentication');
const index = require('../controllers/index');
const auth = require('../controllers/auth');

const router = express.Router();


router.get('/', userAuthenticated, index.getAll);
router.get('/login', auth.getAll);
router.post('/login', auth.post);
router.get('/logout', auth.logout);
router.get('/verify/:id', auth.verify);
router.get('/changepass/:id', auth.changepass);
router.post('/changepass/:id', auth.changepassPost);

module.exports = router;