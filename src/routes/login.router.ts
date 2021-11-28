import { Router } from 'express';
import { UnknownUserError } from '../errors/unknown-user.error';
import { UserService } from '../services/user.services';

const loginRouter = Router();
const userService = new UserService();

/**
 * @openapi
 * /login:
 *   post:
 *     summary: Login a user
 *     description: Login a user
 */
 loginRouter.post('/', (request, response) => {
    try {
        userService.login(request.body.email, request.body.password).then((result) => {
            response.status(200).send(result);
        });
    } catch (error) {
        if (error instanceof UnknownUserError) {
            response.status(401)
        } else {
            response.status(400)
        }
        response.send(error.message)
    }
})

export default loginRouter;