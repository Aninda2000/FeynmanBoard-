const mongoose = require("mongoose");

const userShema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    topicList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Topics",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Users = mongoose.model("Users", userShema);
module.exports = Users;
