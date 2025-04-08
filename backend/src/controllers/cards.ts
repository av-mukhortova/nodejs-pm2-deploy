import { NextFunction, Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import Card from '../models/card';
import NotFoundError from '../errors/not-found-err';
import BadRequestError from '../errors/bad-request-err';
import ForbiddenError from '../errors/forbidden-err';
import { SessionRequest } from '../types';

export const getCards = (_req: Request, res: Response, next: NextFunction) => Card.find({})
  .then((cards) => {
    res.send(cards);
  })
  .catch(next);

export const createCard = (req: any, res: Response, next: NextFunction) => {
  const { name, link } = req.body;

  return Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

export const deleteCardById = (req: SessionRequest, res: Response, next: NextFunction) => {
  Card.findById(req.params.id)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Запрашиваемая карточка не найдена');
      } else {
        const userPayload = req.user as JwtPayload;
        console.log('user', userPayload);
        console.log('owner', card.owner.toString());
        const userId = userPayload ? userPayload._id : null;
        if (userId === card.owner) {
          Card.findByIdAndDelete(req.params.id)
            .then((deletedCard) => {
              res.send(deletedCard);
            });
        } else {
          throw new ForbiddenError('Нет прав на удаление карточки');
        }
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректный формат id карточки'));
      } else {
        next(err);
      }
    });
};

export const likeCard = (req: any, res: Response, next: NextFunction) => Card.findByIdAndUpdate(
  req.params.id,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (!card) {
      throw new NotFoundError('Запрашиваемая карточка не найдена');
    }
    res.send(card);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new BadRequestError('Некорректный формат id карточки'));
    } else {
      next(err);
    }
  });

export const dislikeCard = (req: any, res: Response, next: NextFunction) => Card.findByIdAndUpdate(
  req.params.id,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (!card) {
      throw new NotFoundError('Запрашиваемая карточка не найдена');
    }
    res.send(card);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new BadRequestError('Некорректный формат id карточки'));
    } else {
      next(err);
    }
  });
