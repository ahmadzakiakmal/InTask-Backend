const Project = require("../models/project")

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

module.exports = {
    removeContributor
}
