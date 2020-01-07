const express = require('express');
const router = new express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

const User = require('../models/User');

router.get('/', auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user);
});

router.post(
  '/',
  [
    check('email', 'A valid email is required').isEmail(),
    check('password', 'A password is required')
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

      const { email, password } = req.body;
      let user = await User.findOne({ email });
      if (user)
        return res.status(400).json({
          errors: [
            { msg: 'A user with that email has already been registered' }
          ]
        });
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user = new User({
        email,
        password: hashedPassword
      });

      await user.save();
      await user.save();
      const payload = {
        user: {
          id: user.id
        }
      };
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        {
          expiresIn: 360000
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.log(err);
      res.status(500).send('Server error');
    }
  }
);

router.post(
  '/login',
  [
    check('email', 'A valid email is required')
      .not()
      .isEmpty(),
    check('password', 'A password is required')
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) res.status(400).json({ errors: errors.array() });
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user)
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid login credentials' }] });
      const correctPassword = await bcrypt.compare(password, user.password);
      if (!correctPassword)
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid login credentials' }] });

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        {
          expiresIn: 360000
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
