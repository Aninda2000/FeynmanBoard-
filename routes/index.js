const express = require("express");

const router = express.Router();
const homeController = require("../controllers/home_controller");

router.get("/", homeController.home);
router.get("/dashboard", homeController.dashboard);
router.get("/add-topic", homeController.addTopic);
router.post("/create-user", homeController.createUser);
router.post("/create-new-topic", homeController.createTopic);
router.get("/topic-details/:id", homeController.topicDetails);

router.get("/update/:points/:id", homeController.updateSubTopicPoints);

module.exports = router;
