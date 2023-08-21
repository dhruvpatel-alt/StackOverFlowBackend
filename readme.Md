# Form Management API

This API allows you to manage forms, questions, and user interactions.

## Questions Endpoints

### Get Questions by User ID

Get questions created by a specific user.

- *URL:* `http://localhost:5000/api/questions/user/:id`
- *Method:* GET
- *Params:*
  - `id` - User ID
- *Response:* List of questions created by the user.

### Get All Questions

Get all questions.

- *URL:* `http://localhost:5000/api/questions/all`
- *Method:* GET
- *Response:* List of all questions.

### Delete Question

Delete a question by its ID.

- *URL:* `http://localhost:5000/api/questions/delete/:id`
- *Method:* DELETE
- *Params:*
  - `id` - Question ID
- *Response:* Success message if the question is deleted.

### Update Question

Update a question's details.

- *URL:* `http://localhost:5000/api/questions/update`
- *Method:* PUT
- *Body:*
  - `id` - Question ID
  - `userId` - User ID
  - Other question fields to update
- *Response:* Updated question details.

### Create Question

Create a new question.

- *URL:* `http://localhost:5000/api/questions/create`
- *Method:* POST
- *Body:*
  - `userId` - User ID
  - Other question fields
- *Response:* Newly created question details.

### Upvote Question

Upvote a question by its ID.

- *URL:* `http://localhost:5000/api/questions/upvote/:id`
- *Method:* PUT
- *Params:*
  - `id` - Question ID
- *Response:* Updated question with increased upvote count.

### Downvote Question

Downvote a question by its ID.

- *URL:* `http://localhost:5000/api/questions/downvote/:id`
- *Method:* PUT
- *Params:*
  - `id` - Question ID
- *Response:* Updated question with decreased upvote count.

### Add Comment to Question

Add a comment to a question.

- *URL:* `http://localhost:5000/api/questions/addcomment/:id`
- *Method:* POST
- *Params:*
  - `id` - Question ID
- *Body:*
  - `comment` - Comment text
- *Response:* Updated question with the added comment.

---