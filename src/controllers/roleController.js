import Role from "../schemas/roleSchema.js";
import HttpStatuses from "../enums/httpStatusesEnum.js";
import logger from "../services/logger.js";

const RoleController = {
    getRoleByName: async (req, res) => {
        try {
            let role = await Role.find({
                name: req.body.name
            });

            if (null === role) {
                return res.status(HttpStatuses.NotFound).send(`Role with ${req.body.name} not found`)
            }

            res.status(HttpStatuses.Ok).json(role);
        } catch (error) {
            logger.error(error.message);
            res.status(HttpStatuses.ServerError).json({ message: error.message });
        }
    }
}

export default RoleController