const { removeContributor, addContributor } = require("../controllers/owners");
const { deleteProject} = require("../controllers/owners");

const ownerRouter = require("express").Router();


// TODO: Edit project



// TODO: Delete project
ownerRouter.delete("/project/:project_id", deleteProject);


// TODO: Add contributor
ownerRouter.post("/project/add_contributor", addContributor);


// TODO: Remove contributor
ownerRouter.delete("/contributor", removeContributor);



// TODO: Share / change project privacy



module.exports = ownerRouter;