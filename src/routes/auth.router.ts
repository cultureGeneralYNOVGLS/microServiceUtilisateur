import { Router } from 'express';
import { UserService } from '../services/user.services';

const authRouter = Router();
const userService = new UserService();

/**
 * @openapi
 * /login:
 *   post:
 *     summary: Verify token of the user
 *     description: Verify token of the user
 */
 authRouter.post('/', (request, response) => {
    try {
        const verifyToken = userService.verifyToken(request.body);
        response.status(200).send(verifyToken);
    } catch (error) {
        response.status(400).send(error.message);
    }
})

export default authRouter;