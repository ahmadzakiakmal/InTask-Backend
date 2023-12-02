const Project = require("../models/project");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const process = require("process");

// * Get all projects
const getAllProjects = async (req, res) => {
  const projects = await Project.find();
  res.status(200).json({
    message: "All projects",
    code: 200,
    projects,
  });
};

// * Get projects by username
const getProjects = async (req, res) => {
  const { username } = req.params;

  const projects = await Project.find({$or: [{owner: username}, {contributors: username}]});
  res.status(200).json({
    message: `Projects where ${username} is a part of`,
    code: 200,
    projects,
  });
};

const getProject = async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId);
  res.status(200).json({
    message: `Project with id ${projectId}`,
    code: 200,
    project,
  });
}

// * Create project
const createProject = async (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ message: "title is required", code: 400 });
  }

  const cookies = req.headers.cookie;
  const Authorization = cookies.split(" ")[0];
  const token = Authorization.split("=")[1].replace(";", "");
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded;

  const owner = await User.findOne({ email: req.user.email });

  const project = new Project({
    title,
    description,
    owner: owner.username,
    contributors: [owner.username],
  });

  project.save().catch((err) => {
    res.status(500).json({
      message: "An error occured while creating project",
      code: 500,
      err,
    });
  });

  res.status(201).send({
    message: "Project created successfully",
    code: 201,
    project,
  });
};

// * Update project
const updateProject = async (req, res) => {
  const { projectId } = req.params;
  const { title, description } = req.body;

  try {
    const project = await Project.findById(projectId);

    if(!project) return res.status(400).json({
      message: "project not found",
      code: 400,
    });

    if(title) project.title = title;
    if(description) project.description = description;

    await project.save();

    res.status(200).send({
      message: "Project updated successfully",
      code: 201,
      project,
    });
  }
  catch (err) {
    res.status(500).json({
      message: "An error occured while updating project",
      code: 500,
      err,
    });
  }
}

// * Delete project
const deleteProject = async (req, res) => {
  const { projectId } = req.params;

  Project.findByIdAndDelete(projectId).catch((err) => {
    return res.status(500).json({
      message: "An error occured while deleting project",
      code: 500,
      err,
    });
  });

  res.status(200).send({
    message: "Project deleted successfully",
    code: 200,
  });
};

// * Add contributor
const addContributor = async (req, res) => {
  const { projectId } = req.params;
  const { identifier } = req.body;

  if(!projectId) {
    return res.status(400).json({
      message: "projectId is required",
      code: 400,
    });
  }
  if(!identifier) {
    return res.status(400).json({
      message: "identifier is required",
      code: 400,
    });
  }

  const project = await Project.findById(projectId);
  if (!project) {
    return res.status(404).json({
      message: "Project not found",
      code: 404,
    });
  }
  const user = await User.findOne({
    $or: [{ email: identifier }, { username: identifier }],
  });
  if (!user) {
    return res.status(404).json({
      message: "User not found",
      code: 404,
    });
  }

  project.contributors.push(user.username);
  project.save().catch((err) => {
    return res.status(500).json({
      message: "An error occured while adding contributor",
      code: 500,
      err,
    });
  });

  res.status(200).send({
    message: `${user.username} added as contributor in ${project.title}`,
    code: 200,
  });
};

// * Remove contributor
const removeContributor = async (req, res) => {
  const { projectId, contributorUsername } = req.params;

  if(!projectId) {
    return res.status(400).json({
      message: "projectId is required",
      code: 400,
    });
  }

  const project = await Project.findById(projectId);
  if (!project) {
    return res.status(404).json({
      message: "Project not found",
      code: 404,
    });
  }
  const user = await User.findOne({ username: contributorUsername });
  if (!user) {
    return res.status(404).json({
      message: "User not found",
      code: 404,
    });
  }

  if(user.username === project.owner) {
    return res.status(400).json({
      message: "Cannot remove owner from contributors",
      code: 400,
    });
  }

  const index = project.contributors.indexOf(user.username);
  if (index > -1) {
    project.contributors.splice(index, 1);
  }

  project.save().catch((err) => {
    return res.status(500).json({
      message: "An error occured while removing contributor",
      code: 500,
      err,
    });
  });

  res.status(200).send({
    message: `Contributor ${user.username} removed from ${project.title}`,
    code: 200,
  });
};

module.exports = {
  createProject,
  removeContributor,
  deleteProject,
  addContributor,
  getProjects,
  getAllProjects,
  getProject,
  updateProject
};
