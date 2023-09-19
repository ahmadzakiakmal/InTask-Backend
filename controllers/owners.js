const Project = require("../models/project")

//remove contributor
const removeContributor = async (req, res) => {
    try {
        const {projectId, contributor} = req.query

        const project = await Project.findById(projectId)
        if(!project) req.status(404).json({message: "project Not Found"})

        const contribId = project.contributors.indexOf(contributor)
        if(contribId = -1) req.status(404).json({message: "user is not contributor"})

        project.contributors.splice(contribId, 1)
        await project.save()

        res.status(200).json({message: `${contributor} is removed from ${projectId}`})
    } catch (err) {
        res.status(500).json(err)
    }
}

//delete project
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
}

//add contributor
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
}

module.exports = {
    removeContributor,
    deleteProject,
    addContributor
}
