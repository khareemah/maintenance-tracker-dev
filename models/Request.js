const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema(
  {
    requestType: {
      type: String,
      enum: ['repair', 'maintenance'],
      required: [true, 'please provide type of request you would like to make'],
    },
    approvalStatus: {
      type: String,
      enum: ['approved', 'rejected', 'pending'],
      default: 'pending',
    },
    requestStatus: {
      type: String,
      enum: ['resolved', 'pending'],
      default: 'pending',
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Request', RequestSchema);
