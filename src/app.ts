import express, {Request, Response} from 'express';
import {HTTP_STATUSES} from "./utils/utils";
import {db} from "./db/db";
import {getCoursesRouter} from "./routes/courses.router";
import {getTestsRouter} from "./routes/tests";
import {getUsersRouter} from "./routes/users.router";
import {getUsersCoursesBindingsRouter} from "./routes/users-corses-bindings.router";
import {getVideoRouter} from "./routes/videos.router";

export const app = express()
export const jsonBodyMiddleware = express.json()

app.use(jsonBodyMiddleware)
export const RouterPath = {
    courses: '/courses',
    users: '/users',
    videos: '/videos',
    usersCoursesBindings: '/users-courses-bindings',
    __test__: '/testing/all-data'
}

app.get('/', (req, res) => {
    res.send('Hello Samurai')
})
app.use(RouterPath.courses, getCoursesRouter(db))
app.use(RouterPath.users, getUsersRouter(db))
app.use(RouterPath.videos, getVideoRouter(db))
app.use(RouterPath.usersCoursesBindings, getUsersCoursesBindingsRouter(db))
app.use(RouterPath.__test__, getTestsRouter(db))
