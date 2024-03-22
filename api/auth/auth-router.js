const express = require('express');
const Users = require('./users-model'); // Assuming the users model file path is correctly referenced
const { restricted } = require('../auth/auth-middleware'); // Update the path as necessary to correctly reference your middleware

const router = express.Router();

// [GET] /api/users - Restricted route
router.get('/', restricted, async (req, res, next) => {
  try {
    const users = await Users.find();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
});

// Error handling middleware, if not already set up elsewhere
router.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  });
});

// Don't forget to export the router
module.exports = router;
