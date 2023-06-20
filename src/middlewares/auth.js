import HttpStatuses from "../enums/httpStatusesEnum.js";
import jwt from "jsonwebtoken";

const config = process.env;

const isAuth = (req, res, next) => {
    const token = req.headers.authorization;
    console.log("thisis+ "+config)

    if (!token) {
        return res.status(HttpStatuses.Forbidden).json({ message: "A token is required for authentication" })
    };

    try {
        req.user = jwt.verify(token.split(' ')[1], config.JWT_SECRET_KEY, { algorithm: "HS256" })['user'];
    } catch (err) {

        return res.status(HttpStatuses.Unauthorized).json({ message: "invalid Token" });
    }

    return next();
};

export default isAuth;