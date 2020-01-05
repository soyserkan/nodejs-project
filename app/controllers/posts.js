const fs = require('fs');
const knex = require('../../config/database');
const moment = require('moment');

exports.allRoutes = (req, res, next) => {
    next();
};

exports.findAll = async (req, res) => {
    try {
        const postData = await knex.select('*').from('posts').leftJoin('categories', 'posts.p06', 'categories.cid');
        res.render('posts/index', {
            postData
        });
    } catch (err) {
        throw err;
    }
};

exports.create = async (req, res) => {
    const allowComment = (req.body.p02 === 'on') ? 1 : 0;
    let fileData = 'default.png';
    const date = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    console.log(date);
    if (Object.entries(req.files).length !== 0) {
        const file = req.files.p04[0];
        fileData = file.filename;
    }
    try {
        const savedData = await knex('posts').insert({
            p04: fileData,
            p00: req.body.p00,
            p06: req.body.p06,
            p01: req.body.p01,
            p02: allowComment,
            p05: date,
            p03: req.body.p03
        });
        const data = await knex.select('*').from('posts').leftJoin('categories', 'posts.p06', 'categories.cid').where({ pid: savedData[0] });
        res.send(data);
    } catch (err) {
        throw err;
    }
};

exports.findById = async (req, res) => {
    try {
        const singleData = await knex.select().table('posts').where({ pid: req.params.id });
        res.send(singleData);
    } catch (err) {
        throw err;
    }
};

exports.update = async (req, res) => {
    const allowComment = (req.body.p02 === 'on') ? 1 : 0;
    let fileData = 'default.png';
    if (Object.entries(req.files).length !== 0) {
        const file = req.files.p04[0];
        fileData = file.filename;
    }
    try {
        const singleData = await knex.select().table('posts').where({ pid: req.params.id });
        const filePath = `./public/uploads/${singleData[0].p04}`;
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        await knex('posts').where({ pid: req.params.id }).update({
            p00: req.body.p00,
            p03: req.body.p03,
            p01: req.body.p01,
            p06: req.body.p06,
            p02: allowComment,
            p04: fileData,
        });
        const data = await knex.select('*').from('posts').leftJoin('categories', 'posts.p06', 'categories.cid').where({ pid: req.params.id });
        res.send(data);
    } catch (err) {
        throw err;
    }
};

exports.delete = async (req, res) => {
    try {
        const singleData = await knex.select().table('posts').where({ pid: req.params.id });
        const filePath = `./public/uploads/${singleData[0].p04}`;
        await knex('posts').where('pid', req.params.id).del();
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        res.render('posts/index');
    } catch (err) {
        throw err;
    }
};