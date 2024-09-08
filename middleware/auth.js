const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    //get token form header
    const token = req.header('Authorization');

    //check if no token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied'});
    }

    //verify token
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.id;
        next(); // Proceed to the next middleware/controller
    } catch (error) {
        res.status(401).json({ msg: 'Token is not valid'});
    }
};