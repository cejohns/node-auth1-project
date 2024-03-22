const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session");

// Optional: If using connect-session-knex for session storage
const KnexSessionStore = require('connect-session-knex')(session);
const knex = require('knex')({
  client: 'pg', // Or another database client
  connection: {
    // Database connection information
  },
});

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

// Session configuration
const sessionConfig = {
  name: 'chocolatechip', // The name of the cookie
  secret: 'keep it secret, keep it safe!', // Used to sign the cookie
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 24 hours in milliseconds
    secure: false, // true in production to send the cookie only over HTTPS
    httpOnly: true, // true prevents client-side JavaScript from accessing the cookie
  },
  resave: false,
  saveUninitialized: false, // Important for not setting a cookie unless the user logs in
  store: new KnexSessionStore({
    knex,
    tablename: 'sessions', // Optional. Defaults to 'sessions'
  }), // Comment this out if you don't want to use a session store
};

server.use(session(sessionConfig));

server.get("/", (req, res) => {
  res.json({ api: "up" });
});

server.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  });
});

module.exports = server;
