import express, { response } from 'express';

import multer from 'multer';
import multerConfig from './config/multer';
import { celebrate, Joi } from 'celebrate';

import PointsController from './controllers/PointsController';
import ItemsController from './controllers/ItemsController';
import e from 'express';

// Serve pra conseguir desacoplar as minhas rotas do arquivo principal
// do servidor pra outro arquivo.
const routes = express.Router();
const upload = multer(multerConfig);

const pointsController = new PointsController();
const itemsController = new ItemsController();

// Listar itens
routes.get('/items', itemsController.index);
// Selecionar ponto especifico
routes.get('/points/:id', pointsController.show)
// Criar um ponto
routes.post(
        '/points',        
        upload.single('image'),
        celebrate({
            body: Joi.object().keys({
                name: Joi.string().required(),
                email: Joi.string().required().email(),
                whatsapp: Joi.number().required(),
                latitude: Joi.number().required(),
                longitude: Joi.number().required(),
                uf: Joi.string().required().max(2),
                city: Joi.string().required(),
                items: Joi.string().required(),
            })
        }, {
            abortEarly: false
        }),
        pointsController.create,
        );
// Listar pontos
routes.get('/points/', pointsController.index)


// Linha necessária para routes ser usado por outros arquivos
export default routes;