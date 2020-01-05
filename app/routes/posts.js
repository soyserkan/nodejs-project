const express = require('express');
const multer = require('multer');
const { userAuthenticated } = require('../../helpers/authentication');
const posts = require('../controllers/posts');

const router = express.Router();


const upload = multer({ dest: './public/uploads/' });

router.all('/*', userAuthenticated, posts.allRoutes);

router.get('/', posts.findAll);

router.post('/', upload.fields([{ name: 'p04', maxCount: 1 }]), posts.create);

router.get('/:id', posts.findById);

router.patch('/update/:id', upload.fields([{ name: 'p04', maxCount: 1 }]), posts.update);

router.delete('/delete/:id', posts.delete);

module.exports = router;