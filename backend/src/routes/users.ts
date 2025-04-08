import { Router } from 'express';
import { Joi, celebrate } from 'celebrate';
import {
  getUsers, getUserById, updateUser, updateUserAvatar, getCurrentUser,
} from '../controllers/users';

const router = Router();

router.get('/me', getCurrentUser);

router.get('/', getUsers);

router.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24),
  }),
}), getUserById);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
  }),
}), updateUser);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(/^(https?:\/\/)(www\.)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*$/),
  }),
}), updateUserAvatar);

export default router;
