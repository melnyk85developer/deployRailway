"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const port = process.env.PORT || 5000;
const startApp = () => {
    app_1.app.listen(port, () => {
        console.log(`Сервер стартанул, порт ${port}`);
    });
};
startApp();
