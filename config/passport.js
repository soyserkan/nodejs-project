const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy;
const knex = require('./database');

module.exports = (passport) => {
    passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        const singleData = await knex.select().table('users').where({ u02: email });
        if ((Object.entries(singleData).length === 0)) {
            return done(null, false);
        }
        bcrypt.compare(password, singleData[0].u03, (err, matched) => {
            if (err) return console.log(err);
            if (matched) {
                return done(null, singleData[0]);
            }
            return done(null, false);
        });
    }));

    passport.serializeUser((user, done) => {
        done(null, user.uid);
    });

    passport.deserializeUser((id, done) => {
        knex.select().table('users').where({ uid: id }).then((user) => {
            done(null, user);
        });
    });
};