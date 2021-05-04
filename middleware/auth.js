const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
    let token = req.header('authorization');
    if (!token) return res.status(401).send('Access denied. No token provided.');

    token = token.split(" ")[1];
    try {
        req.user = jwt.verify(token, config.get('jwtPrivateKey'));
        next();
    } catch (ex) {
        res.status(401).send('Invalid token.');
    }
}