import { roles } from "../../Middleware/auth.middleware.js";

export const endPoint = {
    create: [roles.Admin],
    update:[roles.Admin],
    get:[roles.Admin],
    softDelete:[roles.Admin],
    forceDelete:[roles.Admin],
}