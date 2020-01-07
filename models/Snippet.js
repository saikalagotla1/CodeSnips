const mongoose = require('mongoose');

const snippetSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  description: {
    type: String
  },
  files: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'file'
    }
  ],
  joinCode: {
    type: String,
    required: true
  }
});

module.exports = Snippet = mongoose.model('snippet', snippetSchema);
