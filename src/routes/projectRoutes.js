const projectRouter = require("express").Router();

const {
  createProject,
  removeContributor,
  deleteProject,
  addContributor,
} = require("../controllers/projectsControllers");

projectRouter.post("/", createProject);
projectRouter.delete("/:projectId", deleteProject);
projectRouter.post("/:projectId/contributors", addContributor);
projectRouter.delete("/:projectId/contributors/:contributor", removeContributor);

module.exports = projectRouter;