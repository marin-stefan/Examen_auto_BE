import { validationResult } from "express-validator";
import HttpStatuses from "../enums/httpStatusesEnum.js";

const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        return next()
    };

    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));

    return res.status(HttpStatuses.UnProcessableEntity).json({ errors: extractedErrors });
}

export default validate;