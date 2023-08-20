import { roles } from "../../Middleware/auth.middleware.js";

export const endPoint = {
    create: [roles.User],
    update:[roles.User],
    get:[roles.Admin],
    clear:[roles.User],
    getOne:[roles.User]
}