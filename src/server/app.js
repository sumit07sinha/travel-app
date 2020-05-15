var path = require("path");
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var cors = require("cors");

app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("dist"));
let projectData = {};
app.get("/", function (req, res) {
  res.sendStatus(200).sendFile(path.resolve("dist/index.html"));
});
// Post Route
app.post('/add', addPost);
function addPost(req, res) {
  console.log(req.body.depCity);
  projectData['depCity'] = req.body.depCity;
  projectData['arrCity'] = req.body.arrCity;
  projectData['depDate'] = req.body.depDate;
  projectData['weather'] = req.body.weather;
  projectData['summary'] = req.body.summary;
  projectData['daysLeft'] = req.body.daysLeft;
  res.send(projectData);
}

//server setup
const port = 5000;
const server = app.listen(port, listening);

function listening() {
  console.log(`running on localhost: ${port}`);
};
module.exports = app;
