import HttpStatuses from "../enums/httpStatusesEnum.js";
import User from "../schemas/userSchema.js";
import logger from "../services/logger.js";



const UsersController = {

    search: async (req, res) => {
        let query = { roleId: '646b64fb3fbe5b936f890be7' }
        
        if (req.query.lastName) {
            query['lastName'] = req.query.lastName
        };
        let completeResponse = {};
        try {
            let users = await User.find(query, {__v: 0})
            completeResponse['users'] = users
            return res.status(HttpStatuses.Ok).json(completeResponse)
        } catch (error) {
            logger.error(error.message);
            res.status(HttpStatuses.ServerError).json({ message: error.message })
        }
    }
}


export default UsersController