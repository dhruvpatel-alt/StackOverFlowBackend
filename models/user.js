const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcryptjs'); // Import bcrypt library

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  votedQuestions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
  downvotedQuestions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }], // Reference to comments made by the user
});

userSchema.plugin(uniqueValidator);

// Hash the password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    return next(err);
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
