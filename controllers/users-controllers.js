const User = require('../models/user');
const { validationResult } = require('express-validator');
const HttpError = require('../models/error');
const bcrypt = require('bcryptjs'); // Import bcrypt library

const signup = async (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs. Please try again.', 422));
  }

  try {
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return next(new HttpError('User already exists.', 422));
    }

    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password, // Assuming the password has already been hashed in the schema's pre('save') middleware
    });

    await newUser.save();
    res.status(201).json({ user: newUser.toObject({ getters: true }) });
  } catch (err) {
    console.error("Signup error:", err.message);
    const error = new HttpError('Sign up failed. Please try again.', 500);
    return next(error);
  }
};


const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return next(new HttpError('Invalid credentials. Please try again.', 401));
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return next(new HttpError('Invalid credentials. Please try again.', 401));
    }

    res.json({ message: 'Login successful', user: user.toObject({ getters: true }) });
  } catch (err) {
    console.error("Login error:", err.message);
    const error = new HttpError('Login failed. Please try again.', 500);
    return next(error);
  }
};


exports.signup = signup;
exports.login = login;
