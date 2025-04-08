import { Router } from 'express';
import { Joi, celebrate } from 'celebrate';
import {
  getCards, createCard, deleteCardById, likeCard, dislikeCard,
} from '../controllers/cards';

const router = Router();

router.get('/', getCards);

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(/^(https?:\/\/)(www\.)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*$/),
  }),
}), createCard);

router.delete('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24),
  }),
}), deleteCardById);

router.put('/:id/likes', celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24),
  }),
}), likeCard);

router.delete('/:id/likes', celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24),
  }),
}), dislikeCard);

export default router;
