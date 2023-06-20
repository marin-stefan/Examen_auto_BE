import { check } from "express-validator";
import UserRolesEnum from "../enums/userRolesEnum.js";

const roleValidator = {
    getNameRequest: () => {
        return [
            check('name')
                .exists()
                .withMessage('Name is required')
                .trim()
                .notEmpty()
                .withMessage('Name can not be empty')
                .isIn([ UserRolesEnum.Admin, UserRolesEnum.Consumer ])
                .withMessage('This role name does not exist.')
                .escape(),
        ]
    }
}

export default roleValidator;