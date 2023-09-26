const projectRouter = require("express").Router();

const {
  createProject,
  addProjectTask,
  editProject,
  deleteProjectTask,
  updateTaskStatus,
  removeContributor,
  deleteProject,
  addContributor,
} = require("../controllers/projects");

projectRouter.post("/", createProject);
projectRouter.put("/:projectId", editProject);
projectRouter.post("/:projectId/tasks", addProjectTask);
projectRouter.delete("/:projectId/tasks/:taskId", deleteProjectTask);
projectRouter.patch("/:projectId/tasks/:taskId", updateTaskStatus);
projectRouter.delete("/:projectId", deleteProject);
projectRouter.post("/:projectId/contributors", addContributor);
projectRouter.delete("/:projectId/contributors/:contributor", removeContributor);

module.exports = projectRouter;