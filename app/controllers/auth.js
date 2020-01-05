const bcrypt = require('bcryptjs');
const passport = require('passport');
const randomstring = require('randomstring');
const mailer = require('../../config/mailer');
const knex = require('../../config/database');
const config = require('../../config/config');


exports.all = (req, res, next) => {
    req.app.locals.layout = '';
    next();
};

exports.getAll = async (req, res) => {
    res.render('auth/index', { layout: false });
};

exports.post = async (req, res, next) => {
    switch (req.body.action) {
        case 'signin':
            try {
                passport.authenticate('local', (err, user, info) => {
                    if (err) { return next(err); }
                    if (!user) { return res.sendStatus(404); }
                    req.logIn(user, (error) => {
                        if (error) { return next(error); }
                        if (!user.u04) {
                            return res.send('notconfirmed');
                        }
                        res.redirect(200, '/admin');
                    });
                })(req, res, next);
            } catch (err) {
                throw err;
            }
            break;
        case 'signup':
            try {
                const singleData = await knex.select().table('users').where({ u02: req.body.email });
                if ((Object.entries(singleData).length === 0)) {
                    const salt = bcrypt.genSaltSync(10);
                    const hash = bcrypt.hashSync(req.body.password, salt);
                    const secretToken = randomstring.generate();
                    const isactive = false;

                    await knex('users').insert({
                        u00: req.body.firstname,
                        u01: req.body.lastname,
                        u02: req.body.email,
                        u03: hash,
                        u04: isactive,
                        u05: secretToken
                    });

                    const html = `Merhaba,
                    <br/>
                    Üye olduğunuz için teşekkür ederiz!
                    <br/><br/>
                    Lütfen üyeliğinizi tamamlamak için aşağıdaki bağlantıya tıklayınız.
                    <br/>
                    Bağlantı adresi: <a href="${config.site}/admin/verify/${secretToken}">${config.site}/admin/verify/${secretToken}</a>
                    <br/><br/>`;
                    await mailer.sendMail(config.mailer.FromAddress, req.body.email, 'Lütfen emailinizi onaylayınız', html);
                    res.sendStatus(200);
                } else {
                    res.sendStatus(404);
                }
            } catch (err) {
                throw err;
            }
            break;
        case 'forgot':
            try {
                const singleData = await knex.select().table('users').where({ u02: req.body.email });
                const secrettoken = randomstring.generate();
                if ((Object.entries(singleData).length === 0)) {
                    res.sendStatus(404);
                } else {
                    await knex('users').where({ uid: singleData[0].uid }).update({
                        u05: secrettoken,
                    });
                    const html = `Merhaba,
                    <br/><br/>
                    Lütfen şifrenizi değiştirmek için aşağıdaki bağlantıya tıklayınız.
                    <br/>
                    Bağlantı adresi: <a href="${config.site}/admin/changepass/${secrettoken}">${config.site}/admin/changepass/${secrettoken}</a>
                    <br/><br/>`;
                    await mailer.sendMail(config.mailer.FromAddress, req.body.email, 'Parola değiştirme isteği', html);
                    res.sendStatus(200);
                }
            } catch (error) {
                throw error;
            }
            break;
        default:
            break;
    }
};

exports.logout = (req, res) => {
    req.logOut();
    res.redirect('/admin/login');
};

exports.verify = async (req, res, next) => {
    try {
        const userVer = await knex.select().table('users').where({ u05: req.params.id });
        if (Object.entries(userVer).length === 0) {
            res.render('auth/notFound', { layout: false });
        } else {
            await knex('users').where({ uid: userVer[0].uid }).update({
                u04: true,
                u05: ''
            });
            res.redirect('/admin/login');
        }
    } catch (error) {
        next(error);
    }
};

exports.changepass = async (req, res) => {
    try {
        const userVer = await knex.select().table('users').where({ u05: req.params.id });
        if (Object.entries(userVer).length === 0) {
            res.render('auth/notFound', { layout: false });
        } else {
            res.render('auth/changepass', { layout: false, data: req.params.id });
        }
    } catch (error) {
        throw error;
    }
};

exports.changepassPost = async (req, res) => {
    try {
        const userVer = await knex.select().table('users').where({ u05: req.params.id });
        if (Object.entries(userVer).length === 0) {
            res.render('auth/notFound', { layout: false });
        } else {
            const { oldpass, newpass, newpass2 } = req.body;
            bcrypt.compare(oldpass, userVer[0].u03, async (err, matched) => {
                if (err) return console.log(err);
                if (matched) {
                    if (newpass === newpass2) {
                        const salt = bcrypt.genSaltSync(10);
                        const hash = bcrypt.hashSync(newpass, salt);
                        await knex('users').where({ uid: userVer[0].uid }).update({
                            u03: hash,
                            u05: ''
                        });
                        return res.redirect('/admin/login');
                    } else {
                        return res.send('Şifreleriniz birbiriyle uyuşmuyor');
                    }
                } else {
                    return res.send('Eski şifrenizi yanlis girdiniz');
                }
            });
        }
    } catch (error) {
        throw error;
    }
};
