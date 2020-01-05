module.exports = {
    site: 'https://blogsitee.herokuapp.com', // https://blogsitee.herokuapp.com
    port: process.env.PORT || 3000,
    db: {
        host: 'xxx',
        user: 'xxx',
        password: 'xxx',
        database: 'xxx'
    },
    mailer: {
        auth: {
            user: 'xxx',
            password: 'xxx',
        },
        FromAddress: 'admin@gowebajans.com'
    }
};