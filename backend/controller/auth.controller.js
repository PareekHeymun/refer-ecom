const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const { ApiError } = require('../utils/ApiError.util');
const { asyncHandler } = require('../utils/asyncHandler.util');
const { getCookieOptions } = require('../utils/cookieOptions');

const signup = asyncHandler(async function (req, res){
    const {name, email, password, role} = req.body;
    if(!name || !email || !password){
        throw new ApiError(400, 'Missing required fields');
    }
    // Email domain validation
    const emailLower = email.toLowerCase();
    if (!(/@gmail\.com$/.test(emailLower) || /@iiitm\.ac\.in$/.test(emailLower))) {
        throw new ApiError(400, 'Email must end with @gmail.com or @iiitm.ac.in');
    }
    // Password length validation
    if (password.length < 8) {
        throw new ApiError(400, 'Password must be at least 8 characters long');
    }
    // Validate role
    const validRoles = ['buyer', 'seller'];
    if (role && !validRoles.includes(role)) {
        throw new ApiError(400, 'Invalid role. Must be either "buyer" or "seller"');
    }
    try {
        const existingUser = await userModel.findOne({ email });
        if(existingUser){
            throw new ApiError(400, 'User with this email already exists');
        }
        const new_user = new userModel({name, email, password, role: role || 'buyer'});
        await new_user.save();
        res.status(201).json({msg: 'User registered successfully. Please log in.'});
    } catch (err) {
        // If it's a MongoDB connection error
        if (err.name && (err.name === 'MongoNetworkError' || err.message?.includes('failed to connect'))) {
            throw new ApiError(503, 'Internet issue, please try again');
        }
        throw err;
    }
});

const signin = asyncHandler(async function(req, res){
    const {email, password} = req.body;
    const getUser = await userModel.findOne({email});
    if(!getUser){
        throw new ApiError(400, 'User not found');
    }
    const isMatch = await getUser.checkPassword(password);
    if(!isMatch){
        throw new ApiError(400, 'Incorrect email or password');
    }
    const payload_object = {
        id: getUser._id.toString(),
        role: getUser.role.toString(),
        name: getUser.name.toString(),
        email: getUser.email.toString()
    }
    const secret_key = process.env.JWT_SECRET;
    const options_object = {expiresIn : '1h'};
    const GET_TOKEN = jwt.sign(payload_object, secret_key, options_object);
    // Set JWT in HTTP-only cookie
    res.cookie('token', GET_TOKEN, {
        ...getCookieOptions(),
        maxAge: 60 * 60 * 1000 // 1 hour
    });
    res.status(200).json({msg: 'Login successful'});
});

const logout = asyncHandler(async (req, res) => {
    // Clear the JWT cookie with robust options
    res.clearCookie('token', {
        ...getCookieOptions(),
        expires: new Date(0),
        maxAge: 0
    });
    res.status(200).json({msg: 'Logout successful'});
});

const profile = asyncHandler(async (req, res) => {
    if(!req.user.id){
        throw new ApiError(404, 'User not found for provided token');
    }
    res.status(200).json({msg: 'Profile fetched successfully', user: req.user});
});

module.exports = {signup, signin, logout, profile};