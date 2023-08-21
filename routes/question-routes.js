const express = require('express');
const { check } = require('express-validator');
const questionControllers = require('../controllers/question-controllers');

const router = express.Router();

// Create a new question
router.post(
  '/create',
  [
    check('title').not().isEmpty(),
    check('content').not().isEmpty(),
    check('authorId').notEmpty(),
  ],
  questionControllers.createQuestion
);

// Update an existing question
router.patch(
  '/update',
  [
    check('questionId').notEmpty(),
    check('title').not().isEmpty(),
    check('content').not().isEmpty(),
  ],
  questionControllers.updateQuestion
);

// Delete a question
router.delete(
  '/delete/:qid',
  [
    check('userId').notEmpty(), // Require userId in the request body
  ],
  questionControllers.deleteQuestion
);
// Retrieve all questions
router.get('/all', questionControllers.getAllQuestions);

// Retrieve questions for a specific user
router.get('/user/:userId', questionControllers.getQuestionsByUser);
router.post('/upvote/:qid', questionControllers.upvoteQuestion);
router.post('/downvote/:qid', questionControllers.downvoteQuestion);
router.post('/addcomment/:qid', questionControllers.addComment);

// Other routes for upvoting, downvoting, commenting, listing questions, etc. can be added here.

module.exports = router;
