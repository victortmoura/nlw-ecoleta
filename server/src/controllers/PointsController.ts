import knex from '../database/connection';
import {Request, Response} from 'express';

class PointsController {
    async index(request: Request, response: Response) {
        const {
            city,
            uf,
            items
        } = request.query;

        // pegando o items (que e' um array), forcando que seja uma String
        // por meio do cast, realizando split com virgula, percorrendo item
        // por item para realizar um trim nos valores e garantir que funcione
        // caso sejam colocados espacos em branco. 
        const parsedItems = String(items)
            .split(',')
            .map(item => Number(item.trim()));

        const points = await knex('points')
            .join('point_items', 'points.id', '=', 'point_items.point_id')
            .whereIn('point_items.item_id', parsedItems)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('points.*');

        const serializedPoints = points.map(point => {
            return {
                ...point,
                image_url: `http://192.168.1.6:3333/uploads/${point.image}`,
            };
        });

        return response.json(serializedPoints);
    }
    
    async show(request: Request, response: Response) {
        const { id } = request.params;

        // Selecionando um ponto especifico a partir do ID passado como Path Param
        const point = await knex('points').where('id', id).first();

        if(!point) {
            return response.status(400).json({message: 'Point not found'});
        }
        
        const serializedPoint = {
                ...point,
                image_url: `http://192.168.1.6:3333/uploads/${point.image}`,
            };
        
        /**
         * SELECT * FROM items
         * JOIN point_items ON items.id = point_items.item_id
         * WHERE point_items.point_id = { id }
         */

        // Selecionando os items associados ao point especifico por meio de join
        const items = await knex('items')
            .join('point_items', 'items.id', '=', 'point_items.item_id')
            .where('point_items.point_id', id)
            .select('items.title');

        return response.json({point: serializedPoint, items});

    }

    async create(request: Request, response: Response) {
        /* 
         similar to
         const name = request.body.name
         const email = request.body.email
         etc...
        */
         
         const {
             name,
             email,
             whatsapp,
             latitude,
             longitude,
             city,
             uf,
             items
         } = request.body;
     
         const point = {
         image: request.file.filename,
         name,
         email,
         whatsapp,
         latitude,
         longitude,
         city,
         uf,
        }

         const trx = await knex.transaction();
     
         // Insert da tabela POINTS
         const insertedIds = await trx('points').insert(point);
     
         // recuperacao do ID do elemento adicionado
         const point_id = insertedIds[0];
     
         // salvando retorno do metodo map que traz
         // um json
         const pointItems = items
            .split(',')
            .map((item: string) => Number(item.trim()))
            .map((item_id: number) => {
             return {
                 item_id,
                 point_id,
             };
         });
     
         // Insert da tabela PIVO
         await trx('point_items').insert(pointItems);

         await trx.commit();
     
         return response.json({
             id: point_id,
             point,
         });
     }
}

export default PointsController;