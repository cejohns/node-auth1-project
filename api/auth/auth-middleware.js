const db = require('./db');
// Middleware to check if the user session exists
function restricted(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({
      message: "You shall not pass!"
    });
  }
  next(); // Pass control to the next middleware if the session exists
}

// Middleware to check if the username is already taken
function checkUsernameFree(req, res, next) {
  const { username } = req.body;
  // Assuming `db` is your database interface and `users` is the table/collection
  db.users.find({ username: username }, (err, users) => {
    if (users.length > 0) {
      return res.status(422).json({
        message: "Username taken"
      });
    }
    next(); // Pass control to the next middleware if the username is free
  });
}

// Middleware to check if the username exists in the database
function checkUsernameExists(req, res, next) {
  const { username } = req.body;
  // Again, assuming `db` is your database interface
  db.users.find({ username: username }, (err, users) => {
    if (users.length === 0) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }
    next(); // Pass control to the next middleware if the username exists
  });
}

// Middleware to check if the password is of valid length
function checkPasswordLength(req, res, next) {
  const { password } = req.body;
  if (!password || password.length <= 3) {
    return res.status(422).json({
      message: "Password must be longer than 3 chars"
    });
  }
  next(); // Pass control to the next middleware if the password length is valid
}

// Exporting the functions to be used in other modules
module.exports = {
  restricted,
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength
};
