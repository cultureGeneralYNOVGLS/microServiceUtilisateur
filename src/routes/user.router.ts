import { Router } from 'express';
import { UnknownUserError } from '../errors/unknown-user.error';
import { UserModel } from '../models/user.model';
import { UserService } from '../services/user.services';

const userRouter = Router();
const userService = new UserService();

/**
 * @openapi
 * /api/user/getkey:
 *   get:
 *     summary: Retrieve a satus code 200 when app is run
 *     description: Retrieve a satus code 200 when app is run
 */
 userRouter.get('/getkey', async (request, response) => {
    response.sendStatus(200);
});

/**
 * @openapi
 * /api/user:
 *   get:
 *     summary: Retrieve a list of users
 *     description: Retrieve a list of users
 */
userRouter.get('/', (request, response) => {
    try {
        userService.getAllUsers().then((users : UserModel[]) => {
            response.status(200).send(users);
        });
    } catch (error) {
        response.status(400).send(error.message);
    }
});

/**
 * @openapi
 * /api/user/:userID:
 *   get:
 *     summary: Retrieve a user of user collection
 *     description: Retrieve a user of user collection
 */
 userRouter.get('/:userID', (request, response) => {
    try {
        userService.getUserById(request.params.userID).then((user : UserModel) => {
            response.status(200).send(user);
        });
    } catch (error) {
        response.status(400).send(error.message);
    }
});

/**
 * @openapi
 * /api/user:
 *   post:
 *     summary: Create a new user
 *     description: create a new user
 */
 userRouter.post('/', (request, response) => {
    try {
        userService.createUser(request.body).then((user : UserModel) => {
            response.status(200).send(user);
        });
    } catch (error) {
        response.status(400).send(error.message);
    }
});

/**
 * @openapi
 * /api/user/:userID:
 *   put:
 *     summary: Update a user
 *     description: Update a user
 */
 userRouter.patch('/:userID',/* auth,*/ (request, response) => {
    try {
        userService.updateUser(request.params.userID, request.body).then((user : UserModel) => {
            response.status(200).send(user);
        });
    } catch (error) {
        response.status(400).send(error.message);
    }
});

/**
 * @openapi
 * /api/user/:userID:
 *   delete:
 *     summary: Delete a user
 *     description: Delete a user
 */
 userRouter.delete('/:userID', (request, response) => {
    try {
        const deleteUser = userService.deleteUser(request.params.userID);
        response.status(200).send(deleteUser);
    } catch (error) {
        if (error instanceof UnknownUserError) {
            response.status(404)
        } else {
            response.status(400)
        }
        response.send(error.message)
    }
});

export default userRouter;