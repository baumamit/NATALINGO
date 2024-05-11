const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
        try{
                // Use the token only by removing the 'Bearer ' prefix script: https://youtu.be/8Ip0pcwbWYM?feature=shared&t=786
                const token = req.headers.authorization.split(' ')[1];
                const decoded = jwt.verify(token, process.env.JWT_KEY);
                req.userData = decoded;
                next();
        } catch (error) {
                return res.status(401).json({
                        message: 'Auth failed',
                        error: '401'
                });
        }
};