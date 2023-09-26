const Project = require("../models/project");

// * Create project
const createProject = async (req, res) => {
  const infoProject = req.body;

  try {
    const project = await Project.create(infoProject);
    res.status(201).json({ message: "project created!", project });
  } catch (err) {
    res.status(500).json(err);
  }
};

// * Add project task
const addProjectTask = async (req, res) => {
  const projectId = req.params.projectId;
  const tasks = req.body;

  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project Not Found!" });
    }
    project.tasks.push(tasks);
    await project.save();

    res.status(200).json({ message: "Task Successfully Added to Project" });
  } catch (err) {
    res.status(500).json(err);
  }
};
// * Edit project task
const editProject = async (req, res) => {
  const projectId = req.params.projectId;
  const updatedData = req.body;

  try {
    const project = await Project.findByIdAndUpdate(
      projectId,
      updatedData,
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ message: "Project Not Found!" });
    }

    res.status(200).json({ message: "Project Updated Successfully", project });
  } catch (err) {
    res.status(500).json(err);
  }
};

// * Delete project task
const deleteProjectTask = async (req, res) => {
  const projectId = req.params.projectId;
  const taskId = req.params.taskId;

  try {
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project Not Found!" });
    }

    const taskIndex = project.tasks.findIndex((task) => task.equals(taskId));

    if (taskIndex === -1) {
      return res.status(404).json({ message: "Task Not Found In Project!" });
    }

    project.tasks.splice(taskIndex, 1);
    await project.save();

    res.status(200).json({ message: "Task Successfully Deleted from Project" });
  } catch (err) {
    res.status(500).json(err);
  }
};

// * Change project task status
const updateTaskStatus = async (req, res) => {
  const {taskId, status} = req.params;
  try {
    const project = await Project.findOne(
      { "tasks._id": taskId},
      { "tasks.$": 1 }
    );
    project.tasks[0].status = status;
    await project.save();
    res.status(201).json({message: "project task status updated"});
  }
  catch (err) {
    res.status(500).json(err);
  }
};

// * Remove contributor
const removeContributor = async (req, res) => {
  try {
    const {projectId, contributor} = req.query;

    const project = await Project.findById(projectId);
    if(!project) req.status(404).json({message: "project Not Found"});

    const contribId = project.contributors.indexOf(contributor);
    if(contribId == -1) req.status(404).json({message: "user is not contributor"});

    project.contributors.splice(contribId, 1);
    await project.save();

    res.status(200).json({message: `${contributor} is removed from ${projectId}`});
  } catch (err) {
    res.status(500).json(err);
  }
};

// * Delete project
const deleteProject = async (req, res) => {
  const {projectId} = req.params.projectId;
  try{
    const deletedProject = await Project.findByIdAndDelete(projectId);

    if (!deletedProject) {
      return res.status(404).json({ message: "Project Not Found" });
    }

    res.status(200).json({ message: "Project Succesfully Deleted" });
  }
  catch(err){
    res.status(500).json(err);
  }
};

// * Add contributor
const addContributor = async (req, res) => {
  try {
    const { projectId, contributor } = req.body;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "project not found" });
    }

    if (project.contributors.includes(contributor)) {
      return res.status(400).json({ message: "contributor already exists" });
    }

    project.contributors.push(contributor);

    await project.save();

    res.status(200).json({ message: `${contributor} is added to ${projectId}`, project });
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  createProject,
  addProjectTask,
  editProject,
  deleteProjectTask,
  updateTaskStatus,
  removeContributor,
  deleteProject,
  addContributor,
};