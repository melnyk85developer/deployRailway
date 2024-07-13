"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouterPath = exports.jsonBodyMiddleware = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const db_1 = require("./db/db");
const courses_router_1 = require("./routes/courses.router");
const tests_1 = require("./routes/tests");
const users_router_1 = require("./routes/users.router");
const users_corses_bindings_router_1 = require("./routes/users-corses-bindings.router");
const videos_router_1 = require("./routes/videos.router");
exports.app = (0, express_1.default)();
exports.jsonBodyMiddleware = express_1.default.json();
exports.app.use(exports.jsonBodyMiddleware);
exports.RouterPath = {
    courses: '/courses',
    users: '/users',
    videos: '/videos',
    usersCoursesBindings: '/users-courses-bindings',
    __test__: '/testing/all-data'
};
exports.app.get('/', (req, res) => {
    res.send('Hello Samurai');
});
exports.app.use(exports.RouterPath.courses, (0, courses_router_1.getCoursesRouter)(db_1.db));
exports.app.use(exports.RouterPath.users, (0, users_router_1.getUsersRouter)(db_1.db));
exports.app.use(exports.RouterPath.videos, (0, videos_router_1.getVideoRouter)(db_1.db));
exports.app.use(exports.RouterPath.usersCoursesBindings, (0, users_corses_bindings_router_1.getUsersCoursesBindingsRouter)(db_1.db));
exports.app.use(exports.RouterPath.__test__, (0, tests_1.getTestsRouter)(db_1.db));
