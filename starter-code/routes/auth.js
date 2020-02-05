const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

router.get('/signup', (req, res, next) => {
  res.render('signup.hbs');
});

router.get('/login', (req, res) => {
  res.render('login.hbs');
});

router.post('/login', (req, res, next) => {
  const { username, password } = req.body;

  let user;

  User.findOne({ username: username })
    .then(foundUser => {
      if (!foundUser) {
        res.render('signup.hbs', {
          errorMessage: 'Invaled credentials',
        });
        return;
      }
      user = foundUser;
      return bcrypt.compare(password, foundUser.password);
    })
    .then(match => {
      if (!match) {
        res.render('signup.hbs', { errorMessage: 'Invalid credentials' });
        return;
      }
      req.session.user = user;
      res.redirect('/');
    })
    .catch(err => {
      next(err);
    });
});

router.post('/signup', (req, res, next) => {
  const { username, password } = req.body;

  if (!username) {
    res.render('signup.hbs', {
      errorMessage: 'Must supply a username',
    });
    return;
  }
  if (password.length < 6) {
    res.render('singup.hbs', {
      errorMessage: 'Password must be at least 6 characers',
    });
    return;
  }
  User.findOne({ username: username })
    .then(user => {
      if (user) {
        res.render('signup.hbs', {
          errorMessage: 'Username already exists',
        });
        return;
      }
      return bcrypt.hash(password, 10);
    })
    .then(hash => {
      return User.create({ username: username, password: hash });
    })
    .then(createdUser => {
      console.log(createdUser);
      req.session.user = createdUser;
      res.redirect('/');
    })
    .catch(err => {
      next(err);
    });
});

router.get('/private', (req, res, next) => {
  if (!req.session.user) {
    res.redirect('/');
    return;
  }
  res.render('private.hbs');
});

router.get('/main', (req, res, next) => {
  if (!req.session.user) {
    res.redirect('/');
    return;
  }
  res.render('main.hbs');
});

module.exports = router;
