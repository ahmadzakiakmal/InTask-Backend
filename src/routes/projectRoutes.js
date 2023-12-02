const projectRouter = require("express").Router();

const {
  createProject,
  removeContributor,
  deleteProject,
  addContributor,
  getProjects,
  getProject,
  updateProject
} = require("../controllers/projectControllers");
const { 
  addTask, 
  deleteTask, 
  updateTaskStatus, 
  addAssignee, 
  removeAssignee, 
  getProjectTasks 
} = require("../controllers/taskControllers");

const { JWTAuthentication } = require("../middlewares/authentication");
const { 
  authorizeProjectOwner, 
  authorizeContributor, 
  authorizeAssignee 
} = require("../middlewares/authorization");

// Projects
projectRouter.get("/:username", getProjects);
projectRouter.post("/", JWTAuthentication, createProject);
projectRouter.delete("/:projectId", authorizeProjectOwner, deleteProject);
projectRouter.get("/id/:projectId", getProject);
projectRouter.put("/:projectId", updateProject);

// Contributors
projectRouter.post("/:projectId/contributors", authorizeProjectOwner, addContributor);
projectRouter.delete("/:projectId/contributors/:contributorUsername", authorizeProjectOwner, removeContributor);

// Tasks
projectRouter.get("/:projectId/tasks", authorizeContributor, getProjectTasks);
projectRouter.post("/:projectId/tasks", authorizeContributor, addTask);
projectRouter.delete("/:projectId/tasks/:taskId", authorizeContributor, deleteTask);
projectRouter.post("/:projectId/tasks/:taskId/assignees", authorizeContributor, addAssignee);
projectRouter.delete("/:projectId/tasks/:taskId/assignees", authorizeContributor, removeAssignee);
projectRouter.patch("/:projectId/tasks/:taskId", authorizeContributor, updateTaskStatus);


module.exports = projectRouter;