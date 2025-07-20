const jwt = require('jsonwebtoken');
require('dotenv').config();
const { ApiError } = require('../utils/ApiError.util');

const authFunction = function(req, res, next){
    // Read token from HTTP-only cookie
    const token = req.cookies?.token;

    if(!token) {
        return next(new ApiError(400, 'Invalid Authentication'));
    }
    try{
        const decoded_verification_status = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded_verification_status;
        // Do not log sensitive user or token details
        next();
    }catch(err){
        // Optionally log only error type, not sensitive details
        // console.log('JWT verification error:', err.name);
        return next(new ApiError(400, 'Invalid or expired token'));
    }
}

module.exports = authFunction;