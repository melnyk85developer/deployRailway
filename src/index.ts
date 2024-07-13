import { app } from './app';
const port = process.env.PORT || 5000

const startApp = () => {
  app.listen(port, () => {
    console.log(`Сервер стартанул, порт ${port}`)
  })
}
startApp();