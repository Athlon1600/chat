import {UserAuthController} from "../http/controllers/UserAuthController";
import {UserController} from "../http/controllers/UserController";
import {UserModeratorController} from "../http/controllers/UserModeratorController";
import {SafeRouter} from "../framework/routing/SafeRouter";

const router = new SafeRouter();

router.get('/', UserController.index);

router.post('/register', UserAuthController.register);
router.post('/login', UserAuthController.login);

router.get('/:uid', UserController.read);
router.patch('/:uid', UserController.update);
router.delete('/:uid', UserController.delete);

router.post('/:uid/mod', UserModeratorController.mod);
router.post('/:uid/unmod', UserModeratorController.unmod);

export const users = router.router;
