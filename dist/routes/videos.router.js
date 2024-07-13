"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVideoRouter = exports.mapEntityTyViewModel = void 0;
const express_1 = __importDefault(require("express"));
const utils_1 = require("../utils/utils");
const mapEntityTyViewModel = (dbEntity) => {
    return {
        userId: dbEntity.userId,
        userName: dbEntity.userName
    };
};
exports.mapEntityTyViewModel = mapEntityTyViewModel;
const getVideoRouter = (db) => {
    const router = express_1.default.Router();
    router.get('/', (req, res) => {
        let foundVideos = db.videos;
        if (req.query.title) {
            foundVideos = foundVideos
                .filter(v => v.title.indexOf(req.query.title) > -1);
        }
        res.json(foundVideos);
    });
    router.get('/:id', (req, res) => {
        const foundVideo = db.videos.find(v => v.id === +req.params.id);
        if (!foundVideo) {
            res.sendStatus(utils_1.HTTP_STATUSES.NOT_FOUND_404);
            return;
        }
        res.json(foundVideo);
    });
    router.post('/', (req, res) => {
        if (!req.body.title || !req.body.author) {
            res
                .status(utils_1.HTTP_STATUSES.BAD_REQUEST_400)
                .json({
                errorsMessages: [
                    {
                        message: 'Пустой title',
                        field: 'Пустой author'
                    }
                ]
            });
            return;
        }
        const createVideo = {
            id: +(new Date()),
            title: req.body.title,
            author: req.body.author,
            availableResolutions: req.body.availableResolutions,
            canBeDownloaded: true,
            minAgeRestriction: req.body.minAgeRestriction ? req.body.minAgeRestriction : null,
            createdAt: String(new Date()),
            publicationDate: String(new Date())
        };
        db.videos.push(createVideo);
        res
            .status(utils_1.HTTP_STATUSES.CREATED_201)
            .json(createVideo);
    });
    router.delete('/:id', (req, res) => {
        const id = +req.params.id;
        const videoExists = db.videos.some(v => v.id === id);
        if (!videoExists) {
            res
                .status(utils_1.HTTP_STATUSES.NOT_FOUND_404)
                .send('Такого видео не найдено');
            return;
        }
        db.videos = db.videos.filter(v => v.id !== id);
        res.status(utils_1.HTTP_STATUSES.NO_CONTENT_204).send('Видео успешно удалено!');
    });
    router.put('/:id', (req, res) => {
        if (!req.body.title || !req.body.author) {
            res
                .status(utils_1.HTTP_STATUSES.BAD_REQUEST_400)
                .json({
                errorsMessages: [
                    {
                        message: 'Пустой title',
                        field: 'Пустой author'
                    }
                ]
            });
            return;
        }
        const foundVideo = db.videos.find(v => v.id === +req.params.id);
        if (!foundVideo) {
            res
                .status(utils_1.HTTP_STATUSES.NOT_FOUND_404)
                .json({
                errorsMessages: [
                    {
                        message: 'Такого видео не найдено',
                        field: 'Пустой author'
                    }
                ]
            });
            return;
        }
        foundVideo.title = req.body.title;
        res.sendStatus(utils_1.HTTP_STATUSES.NO_CONTENT_204);
    });
    return router;
};
exports.getVideoRouter = getVideoRouter;
