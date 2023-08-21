const  Question  = require('../models/question');
const User = require('../models/user'); // Import the User model
const HttpError = require('../models/error');


const getAllQuestions = async (req, res, next) => {
    let questions;
    try {
      questions = await Question.find();
    } catch (err) {
      const error = new HttpError('Fetching questions failed, please try again later.', 500);
      return next(error);
    }
    
    res.status(200).json({
      questions: questions.map(question => question.toObject({ getters: true }))
    });
  };
  

  
// Create a new question
const createQuestion = async (req, res, next) => {
    const { title, content, authorId } = req.body; // Change to authorId
  
    try {
      const author = await User.findById(authorId); // Find the author by ID
  
      if (!author) {
        return res.status(404).json({ message: 'Author not found.' });
      }
  
      const newQuestion = new Question({
        title,
        content,
        author: authorId, // Set the author ID
      });
  
      await newQuestion.save();
      res.status(201).json({ question: newQuestion.toObject({ getters: true }) });
    } catch (err) {
      console.error(err);
      const error = new HttpError('Creating question failed, please try again.', 500);
      return next(error);
    }
  };
  
  // Update an existing question
  const updateQuestion = async (req, res, next) => {
      const { questionId, title, content, userId } = req.body; // Add userId
  
      let question;
      try {
        question = await Question.findById(questionId);
      } catch (err) {
        const error = new HttpError('Something went wrong, could not update question.', 500);
        return next(error);
      }
  
      if (!question) {
        const error = new HttpError('Question not found.', 404);
        return next(error);
      }
  
      // Check if the logged-in user's ID matches the author's ID
      if (question.author.toString() !== userId) {
        const error = new HttpError('You are not authorized to update this question.', 401);
        return next(error);
      }
  
      question.title = title;
      question.content = content;
  
      try {
        await question.save();
        res.status(200).json({ question: question.toObject({ getters: true }) });
      } catch (err) {
        const error = new HttpError('Updating question failed, please try again.', 500);
        return next(error);
      }
    };
    
    // Delete a question
    const deleteQuestion = async (req, res, next) => {
      const questionId = req.params.qid;
      const userId = req.body.userId; // Assuming you're passing userId in the request body
  
      let question;
      try {
        question = await Question.findById(questionId);
      } catch (err) {
        const error = new HttpError('Something went wrong, could not delete question.', 500);
        return next(error);
      }
  
      if (!question) {
        const error = new HttpError('Question not found.', 404);
        return next(error);
      }
  
      // Check if the logged-in user's ID matches the author's ID
      if (question.author.toString() !== userId) {
        const error = new HttpError('You are not authorized to delete this question.', 401);
        return next(error);
      }
  
      try {
        await Question.findByIdAndDelete(questionId);
        res.status(200).json({ message: 'Question deleted successfully.' });
      } catch (err) {
        console.error(err);
        const error = new HttpError('Deleting question failed, please try again.', 500);
        return next(error);
      }
    };
  
  
  
  
  const getQuestionsByUser = async (req, res, next) => {
    const userId = req.params.userId;
    
    let userQuestions;
    try {
      userQuestions = await Question.find({ author: userId });
    } catch (err) {
      const error = new HttpError('Fetching user questions failed, please try again later.', 500);
      return next(error);
    }
    
    res.status(200).json({
      userQuestions: userQuestions.map(question => question.toObject({ getters: true }))
    });
  };
  
  
  const upvoteQuestion = async (req, res, next) => {
    const questionId = req.params.qid;
    const userId = req.body.userId;
  
    try {
      const question = await Question.findById(questionId);
  
      if (!question) {
        const error = new HttpError('Question not found.', 404);
        return next(error);
      }
  
      if (question.voters.includes(userId)) {
        const error = new HttpError('You have already voted on this question.', 422);
        return next(error);
      }
  
      // If the user has downvoted before, remove the downvote and increment upvotes
      if (question.downvotes > 0 && question.voters.includes(userId)) {
        question.downvotes--;
        const user = await User.findById(userId);
        user.downvotedQuestions.pull(question._id);
        await user.save();
      }
  
      question.upvotes++;
      question.voters.push(userId);
  
      // Update user's information
      const user = await User.findById(userId);
      user.votedQuestions.push(question._id);
      await user.save();
  
      await question.save();
  
      res.status(200).json({ question });
    } catch (err) {
      console.log(err.message);
      const error = new HttpError('Upvoting question failed.', 500);
      return next(error);
    }
  };
  
  const downvoteQuestion = async (req, res, next) => {
    const questionId = req.params.qid;
    const userId = req.body.userId;
  
    try {
      const question = await Question.findById(questionId);
  
      if (!question) {
        const error = new HttpError('Question not found.', 404);
        return next(error);
      }
  
      if (question.voters.includes(userId)) {
        // If the user has upvoted before, remove the upvote and increment downvotes
        if (question.upvotes > 0) {
          question.upvotes--;
          const user = await User.findById(userId);
          user.votedQuestions.pull(question._id);
          await user.save();
        } else {
          const error = new HttpError('You have already voted on this question.', 422);
          return next(error);
        }
      }
  
      question.downvotes++;
      question.voters.push(userId);
  
      // Update user's information
      const user = await User.findById(userId);
      user.downvotedQuestions.push(question._id);
      await user.save();
  
      await question.save();
  
      res.status(200).json({ question });
    } catch (err) {
      const error = new HttpError('Downvoting question failed.', 500);
      return next(error);
    }
  };
  
  // Export other controller functions here
  
  exports.upvoteQuestion = upvoteQuestion;
  exports.downvoteQuestion = downvoteQuestion;
  
  const addComment = async (req, res, next) => {
    const questionId = req.params.qid;
    const { content, userId } = req.body;
  
    try {
      const question = await Question.findById(questionId);
  
      if (!question) {
        const error = new HttpError('Question not found.', 404);
        return next(error);
      }
  
      const newComment = {
        content,
        author: userId,
        createdAt: new Date(),
      };
  
      question.comments.push(newComment);
      await question.save();
  
      const user = await User.findById(userId);
      user.comments.push(question.comments[question.comments.length - 1]._id); // Add the comment's ObjectId to the user's comments array
      await user.save();
  
      res.status(201).json({ question });
    } catch (err) {
      const error = new HttpError('Adding comment failed.', 500);
      return next(error);
    }
  };
  
  // Export other controller functions here
  

exports.addComment = addComment;
  exports.createQuestion = createQuestion;
  exports.updateQuestion = updateQuestion;
  exports.deleteQuestion = deleteQuestion;
  exports.getAllQuestions = getAllQuestions;
  exports.getQuestionsByUser = getQuestionsByUser;
  exports.upvoteQuestion = upvoteQuestion;
  exports.downvoteQuestion = downvoteQuestion;