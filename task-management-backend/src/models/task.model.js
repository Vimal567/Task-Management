const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    days: {
      type: Number
    },
    due: {
      type: Date,
      required: [true, 'Due date is required'],
      validate: {
        validator: function (value) {
          // Ensure the due date is not in the past
          return value > Date.now();
        },
        message: 'Due date must be in the future.',
      },
    },
    account_id: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;