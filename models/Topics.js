const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema(
  {
    topicName: {
      type: String,
      required: true,
    },
    content: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "subTopics",
      },
    ],
    text: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    currentPoints: {
      type: Number,
    },
    percentage: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const Topics = mongoose.model("Topics", topicSchema);
module.exports = Topics;
