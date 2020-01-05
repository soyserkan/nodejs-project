const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const passport = require('passport');
const session = require('express-session');
const { generateTime } = require('./helpers/handlebars-helpers');
const { port } = require('./config/config');


const app = express();

require('./config/passport')(passport);

app.use(express.static(`${__dirname}/public`));

app.engine('handlebars', exphbs({
    defaultLayout: 'admin',
    layoutsDir: `${__dirname}/app/views/layout`,
    helpers: {
        generateTime
    }
}));

app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/app/views`);

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.user = null;
    if (req.user !== undefined) {
        res.locals.user = req.user[0];
    }
    next();
});

const adminRouter = require('./app/routes/index');
const postRouter = require('./app/routes/posts');


app.use('/admin', adminRouter);
app.use('/admin/posts', postRouter);


app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});