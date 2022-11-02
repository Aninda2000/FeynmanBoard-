const Topics = require("../models/Topics");
const Users = require("../models/Users");
const SubTopics = require("../models/subTopics");

module.exports.home = function (req, res) {
  return res.render("home", {
    title: "home",
  });
};

module.exports.dashboard = async function (req, res) {
  try {
    if (req.cookies.userName) {
      let user = await Users.findById(req.cookies.userName).populate({
        path: "topicList",
      });
      console.log(user);
      return res.render("dashboard", {
        title: "Dashboard",
        topics: user.topicList,
      });
    } else {
      return res.redirect("/");
    }
  } catch (err) {
    console.log(`Error in dashboard********${err}`);
  }
};

module.exports.addTopic = function (req, res) {
  return res.render("addTopic", {
    title: "AddTopic",
  });
};

module.exports.createUser = async function (req, res) {
  try {
    let user = await Users.findOne({ userName: req.body.userName });
    if (user) {
      res.cookie("userName", user._id);
      return res.redirect("/dashboard");
    } else {
      user = await Users.create({ userName: req.body.userName });
      res.cookie("userName", user._id);
      return res.redirect("/dashboard");
    }
  } catch (err) {
    console.log(`Error while creating user*****${err}`);
  }
};
async function createSubContent(content, topic) {
  try {
    var arr = [];
    var symbol = [",", ".", ";", "-", "/", ":", "?", "|"];
    let start = 0;
    let i;
    for (i = 0; i < content.length; i++) {
      for (let j = 0; j < symbol.length; j++) {
        if (content.charAt(i) == symbol[j]) {
          let sentence = content.substring(start, i);
          let subtopic = await SubTopics.create({
            content: sentence,
            topic: topic._id,
            points: 0,
          });
          arr.push(subtopic);
          start = i + 1;
        }
      }
    }
    let sentence = content.substring(start, i);
    let subtopic = await SubTopics.create({
      content: sentence,
      topic: topic._id,
      points: 0,
    });
    arr.push(subtopic);
    return arr;
  } catch (err) {
    console.log(`Error in creating subcontent******${err}`);
  }
}
module.exports.createTopic = async function (req, res) {
  try {
    //check if the username already exists or not

    if (req.cookies.userName) {
      let user = await Users.findById(req.cookies.userName);
      if (user) {
        let newTopic = await Topics.create({
          topicName: req.body.title,
          content: [],
          user: user._id,
          text: req.body.content,
          percentage: 0,
        });
        newTopic.content = await createSubContent(
          req.body.content,
          newTopic._id
        );
        newTopic.save();
        user.topicList.push(newTopic);
        user.save();
        return res.redirect("/dashboard");
      } else {
        return res.redirect("/");
      }
    } else {
      res.redirect("/");
    }
  } catch (err) {
    console.log(`Error in creating Topic******${err}`);
  }
};

module.exports.topicDetails = async function (req, res) {
  try {
    let topic = await Topics.findById(req.params.id).populate({
      path: "content",
    });
    return res.render("topicDetails", {
      title: "topic-details-page",
      topic,
    });
  } catch (err) {
    console.log(`Error in topicDetails********${err}`);
  }
};

async function calculatePoints(topic) {
  try {
    let totalPoints = 0;
    for (let i = 0; i < topic.content.length; i++) {
      let subtopic = await SubTopics.findById(topic.content[i]);
      totalPoints += subtopic.points;
    }
    return totalPoints;
  } catch (err) {
    console.log(`Error in calculating points********${err}`);
  }
}

module.exports.updateSubTopicPoints = async function (req, res) {
  try {
    let subtopic = await SubTopics.findById(req.params.id);
    subtopic.points = req.params.points;
    subtopic.save();
    let topic = await Topics.findById(subtopic.topic);
    let currentPoints = await calculatePoints(topic);
    let totalPoints = 4 * topic.content.length;
    let percentage = (currentPoints / totalPoints) * 100;
    percentage = parseInt(percentage);
    topic.percentage = percentage;
    topic.currentPoints = currentPoints;
    topic.save();
    return res.redirect("back");
  } catch (error) {
    console.log(`Error while updating Points*******${error}`);
  }
};
