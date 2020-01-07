const mongoose = require('mongoose');
const fileSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true
  },
  code: {
    type: String,
    default: `class Main 
    { 
        public static void main (String[] args) 
        { 
          System.out.println("Hello world");
        } 
    }`
    // required: true
  },
  language: {
    type: String,
    default: 'java'
    // required: true
  }
});

module.exports = File = mongoose.model('file', fileSchema);
