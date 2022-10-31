const mongoose = require("mongoose");

const subTopicSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },

    topic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topics",
    },
    points: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const subTopics = mongoose.model("subTopics", subTopicSchema);
module.exports = subTopics;
