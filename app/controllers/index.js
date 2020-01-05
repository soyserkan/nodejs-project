
exports.all = (req, res, next) => {
    req.app.locals.layout = 'admin';
    next();
};

exports.getAll = async (req, res) => {
    res.render('index');
};
