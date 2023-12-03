const Task = require("../models/task");
const Project = require("../models/project");
const User = require("../models/user");

// * Get Project Tasks
const getProjectTasks = async (req, res) => {
  const { projectId } = req.params;
  if (!projectId || projectId === undefined) {
    return res.status(400).json({
      message: "projectId is required",
      code: 400,
    });
  }
  try {
    const project = await Project.findById(projectId).populate("tasks");
    const assignees = await Promise.all(
      project.tasks.map(async (task) => {
        const users = await Promise.all(
          task.assignees.map(async (username) => {
            const user = await User.findOne({ username });
            return {
              username: user.username,
              emoticon: user.emoticon,
            };
          })
        );
        return users;
      })
    );

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
        code: 404,
      });
    } else {
      return res.status(200).send({
        message: "Project tasks retrieved successfully",
        code: 200,
        tasks: project.tasks,
        assignees,
      });
    }
  } catch {
    return res.status(500).json({
      message: "An error occured while retrieving project tasks",
      code: 500,
    });
  }
};

// * Add task
const addTask = async (req, res) => {
  const { projectId } = req.params;
  const { name, description, status, assignees } = req.body;

  if (!projectId) {
    return res.status(400).json({
      message: "projectId is required",
      code: 400,
    });
  }
  if (!name) {
    return res.status(400).json({
      message: "name is required",
      code: 400,
    });
  }

  const task = new Task({
    name,
    description: description || "No description provided",
    status: status ?? "todo",
    assignees: assignees ?? [],
  });

  task
    .save()
    .then(async () => {
      const project = await Project.findById(projectId);
      if (!project) {
        throw new Error("Project not found");
      }
      project.tasks.push(task._id);
      project
        .save()
        .then(() => {
          return res.status(201).send({
            message: "Task created successfully",
            code: 201,
            task,
          });
        })
        .catch((err) => {
          return res.status(500).json({
            message: "An error occured while adding task to project",
            code: 500,
            err,
          });
        });
    })
    .catch((err) => {
      return res.status(500).json({
        message: "An error occured while creating task",
        code: 500,
        err,
      });
    });
};

// * Delete task
const deleteTask = async (req, res) => {
  const { projectId, taskId } = req.params;

  Task.findByIdAndDelete(taskId)
    .then(async () => {
      const project = await Project.findById(projectId);
      if (!project) {
        throw new Error("Project not found");
      }
      project.tasks = project.tasks.filter((task) => task._id != taskId);
      project
        .save()
        .catch((err) => {
          return res.status(500).json({
            message: "An error occured while deleting task from project",
            code: 500,
            err,
          });
        })
        .then(() => {
          return res.status(200).send({
            message: "Task deleted successfully",
            code: 200,
          });
        });
    })
    .catch((err) => {
      return res.status(500).json({
        message: "An error occured while deleting task",
        code: 500,
        err,
      });
    });
};

// * Add assignee
const addAssignee = async (req, res) => {
  const { taskId } = req.params;

  const { identifier } = req.body;

  if (!taskId) {
    return res.status(400).json({
      message: "taskId is required",
      code: 400,
    });
  }

  if (!identifier) {
    return res.status(400).json({
      message: "identifier is required",
      code: 400,
    });
  }

  const user = await User.findOne({
    $or: [{ username: identifier }, { email: identifier }],
  });
  if (!user) {
    return res.status(404).json({
      message: "User not found",
      code: 404,
    });
  }

  Task.findById(taskId)
    .then((task) => {
      if (!task) {
        return res.status(404).json({
          message: "Task not found",
          code: 404,
        });
      }
      task.assignees.push(user.username);
      task
        .save()
        .then(() => {
          return res.status(200).send({
            message: "Assignee added successfully",
            code: 200,
          });
        })
        .catch((err) => {
          return res.status(500).json({
            message: "An error occured while adding assignee",
            code: 500,
            err,
          });
        });
    })
    .catch((err) => {
      return res.status(500).json({
        message: "An error occured while adding assignee",
        code: 500,
        err,
      });
    });
};

// * Delete assignee
const removeAssignee = async (req, res) => {
  const { taskId } = req.params;
  const { identifier } = req.body;

  if (!taskId) {
    return res.status(400).json({
      message: "taskId is required",
      code: 400,
    });
  }

  if (!identifier) {
    return res.status(400).json({
      message: "identifier is required",
      code: 400,
    });
  }

  const user = await User.findOne({
    $or: [{ username: identifier }, { email: identifier }],
  });
  Task.findByIdAndUpdate(taskId, { $pull: { assignees: user.username } })
    .then(() => {
      return res.status(200).send({
        message: "Assignee deleted successfully",
        code: 200,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        message: "An error occured while deleting assignee",
        code: 500,
        err,
      });
    });
};

// * Update task status
const updateTaskStatus = async (req, res) => {
  const { projectId, taskId } = req.params;
  const { status } = req.body;

  if (!projectId) {
    return res.status(400).json({
      message: "projectId is required",
      code: 400,
    });
  }

  if (!taskId) {
    return res.status(400).json({
      message: "taskId is required",
      code: 400,
    });
  }

  if (!status) {
    return res.status(400).json({
      message: "status is required",
      code: 400,
    });
  }

  Task.findByIdAndUpdate(taskId, { status: status })
    .then(() => {
      return res.status(200).send({
        message: "Task status updated successfully",
        code: 200,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        message: "An error occured while updating task status",
        code: 500,
        err,
      });
    });
};

module.exports = {
  getProjectTasks,
  addTask,
  deleteTask,
  updateTaskStatus,
  addAssignee,
  removeAssignee,
};
