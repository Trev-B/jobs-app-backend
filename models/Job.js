const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, 'Please enter a company name'],
      maxlength: 50,
    },
    position: {
      type: String,
      required: [true, 'Please enter a position'],
      maxlength: 100,
    },
    status: {
      type: String,
      enum: ['interview', 'declined', 'pending'],
      default: 'pending',
    },
    location: {
      type: String,
      required: [true, 'Please enter a location'],
      maxlength: 50,
    },
    experience: {
      type: String,
      maxLength: 100,
    },
    link: {
      type: String,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide a user'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', JobSchema);
