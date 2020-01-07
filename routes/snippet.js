const express = require('express');
const router = new express.Router();
const { check, validationResult } = require('express-validator');

const generateUniqueCode = require('../utils/generateUniqueCode');
const auth = require('../middleware/auth');

const User = require('../models/User');
const File = require('../models/File');
const Snippet = require('../models/Snippet');

router.post(
  '/',
  [
    check('name', 'A snippet name is required')
      .not()
      .isEmpty()
    // check('description')
  ],
  auth,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

      const { description, name } = req.body;
      const joinCode = generateUniqueCode(7);
      const snippet = new Snippet({
        name,
        owner: req.user.id,
        joinCode,
        description: description ? description : ''
      });

      await snippet.save();
      const user = await User.findById(req.user.id);
      user.ownedSnippets = [snippet.id, ...user.ownedSnippets];
      await user.save();
      res.json({ snippet });
    } catch (err) {
      console.log(err);
      res.status(500).send('Server error');
    }
  }
);

router.get('/', auth, async (req, res) => {
  const user = await User.findById(req.user.id)
    .select('ownedSnippets joinedSnippets')
    .populate('ownedSnippets joinedSnippets');
  return res.json({
    ownedSnippets: user.ownedSnippets,
    joinedSnippets: user.joinedSnippets
  });
});

router.get('/:snippetId', auth, async (req, res) => {
  const { snippetId } = req.params;
  const user = await User.findById(req.user.id);

  let hasAccessToSnippet =
    user.ownedSnippets.includes(snippetId) ||
    user.joinedSnippets.includes(snippetId);

  if (!hasAccessToSnippet)
    return res
      .status(400)
      .json({ errors: [{ msg: 'Sorry you do not have access to that' }] });

  const snippet = await Snippet.findById(snippetId).populate('files');

  res.json({ snippet });
});

router.post(
  '/join',
  auth,
  [
    check('joinCode', 'Join code is required')
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    try {
      const { joinCode } = req.body;
      const snippet = await Snippet.findOne({ joinCode });

      if (!snippet)
        return res.status(400).json({
          errors: [{ msg: 'A snippet was not found with that code' }]
        });
      const user = await User.findById(req.user.id);
      const alreadyJoined =
        user.ownedSnippets.includes(snippet.id) ||
        user.joinedSnippets.includes(snippet.id);

      if (alreadyJoined)
        return res
          .status(400)
          .json({ errors: [{ msg: 'You are already part of this snippet' }] });

      user.joinedSnippets = [snippet.id, ...user.joinedSnippets];
      await user.save();
    } catch (err) {
      console.log(err);
      res.status(500).send('Server error');
    }
  }
);

router.post(
  '/:snippetId/file',
  [
    check('fileName', 'Valid filename is required')
      .not()
      .isEmpty()
  ],
  auth,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    const { snippetId } = req.params;
    const user = await User.findById(req.user.id);

    let hasAccessToSnippet = user.ownedSnippets.includes(snippetId);

    if (!hasAccessToSnippet)
      return res.status(400).json({
        errors: [{ msg: 'Sorry you do not have access to that file' }]
      });

    const { fileName } = req.body;
    const file = new File({ fileName });
    await file.save();

    const snippet = await Snippet.findById(snippetId);

    snippet.files = [file, ...snippet.files];
    await snippet.save();
    res.json({ file });
  }
);

module.exports = router;
