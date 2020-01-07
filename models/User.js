const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  ownedSnippets: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'snippet'
    }
  ],
  joinedSnippets: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'snippet'
    }
  ]
});

module.exports = User = mongoose.model('user', userSchema);
