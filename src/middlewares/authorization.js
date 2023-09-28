const User = require("../models/user");
const Project = require("../models/project");
const Task = require("../models/task");
const jwt = require("jsonwebtoken");
const process = require("process");

const authorizeAdmin = (req, res, next) => {
  const cookies = req.headers.cookie;
  const Authorization = cookies.split(" ")[0];
  // console.log(Authorization);
  const token = Authorization.split("=")[1].replace(";", "");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch (err) {
    return res.status(401).json({ 
      message: "Invalid JWT token",
      code: 401
    });
  }

  User.findOne({ email: req.user.email })
    .then((user) => {
      if (user.role !== "admin") {
        return res.status(403).json({
          message: "Admin resource. Access denied",
          code: 403
        });
      }
      next();
    })
    .catch((err) => {
      return res.status(500).json({
        message: "Internal Server Error",
        code: err.code
      });
    });
};

const authorizeProjectOwner = async (req, res, next) => {
  const { projectId } = req.params;
  const cookies = req.headers.cookie;
  const Authorization = cookies.split(" ")[0];
  const token = Authorization.split("=")[1].replace(";", "");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch (err) {
    return res.status(401).json({ 
      message: "Invalid JWT token",
      code: 401
    });
  }

  const user = await User.findOne({ email: req.user.email });
  if(!user) {
    return res.status(404).json({
      message: "User not found",
      code: 404
    });
  }
  
  try {
    const project = await Project.findById(projectId);
    if(!project) {
      return res.status(404).json({
        message: "Project not found",
        code: 404
      });
    }
    if(user.username !== project.owner) {
      return res.status(403).json({
        message: "Project owner resource. Access denied",
        code: 403
      });
    }
  } catch {
    return res.status(500).json({
      message: "Internal Server Error",
      code: 500
    });
  }
  

  next();
};

const authorizeContributor = async (req, res, next) => {
  const { projectId } = req.params;
  const cookies = req.headers.cookie;
  const Authorization = cookies.split(" ")[0];
  const token = Authorization.split("=")[1].replace(";", "");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch {
    return res.status(401).json({ 
      message: "Invalid JWT token",
      code: 401
    });
  }

  const user = await User.findOne({ email: req.user.email });
  if(!user) {
    return res.status(404).json({
      message: "User not found",
      code: 404
    });
  }

  try {
    const project = await Project.findById(projectId);
    if(!project) {
      return res.status(404).json({
        message: "Project not found",
        code: 404
      });
    }

    if(!project.contributors.includes(user.username)) {
      return res.status(403).json({
        message: "Contributor resource. Access denied",
        code: 403
      });
    }
  } catch {
    return res.status(500).json({
      message: "Internal Server Error",
      code: 500
    });
  }

  next();
};

const authorizeAssignee = async (req, res, next) => {
  const { projectId, taskId } = req.params;
  const cookies = req.headers.cookie;
  const Authorization = cookies.split(" ")[0];
  const token = Authorization.split("=")[1].replace(";", "");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch {
    return res.status(401).json({ 
      message: "Invalid JWT token",
      code: 401
    });
  }

  const user = await User.findOne({ email: req.user.email });
  if(!user) {
    return res.status(404).json({
      message: "User not found",
      code: 404
    });
  }

  try {
    const project = await Project.findById(projectId);
    if(!project) {
      return res.status(404).json({
        message: "Project not found",
        code: 404
      });
    }

    if(project.owner !== user.username) {
      return res.status(403).json({
        message: "Only owner and assignee can update task status",
        code: 403
      });
    }

    const task = await Task.findById(taskId);
    if(!task) {
      return res.status(404).json({
        message: "Task not found",
        code: 404
      });
    }

    if(!task.assignees.includes(user.username)) {
      return res.status(403).json({
        message: "Only owner and assignee can update task status",
        code: 403
      });
    }
  } catch {
    return res.status(500).json({
      message: "Internal Server Error",
      code: 500
    });
  }

  next();
};

module.exports = {authorizeAdmin, authorizeProjectOwner, authorizeContributor, authorizeAssignee};