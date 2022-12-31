import {MessageController} from "../http/controllers/MessageController";
import {SafeRouter} from "../framework/routing/SafeRouter";

const safeRouter = new SafeRouter();

safeRouter.get('/', MessageController.all);
safeRouter.post('/', MessageController.create);
safeRouter.delete('/:id', MessageController.delete);

export const messages = safeRouter.router;
