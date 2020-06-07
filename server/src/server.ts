import express, { response } from 'express';
import path from 'path';
import cors from 'cors';
import routes from './routes';
import {errors} from 'celebrate';

// Rota: Endereço completo da requisição
// ex: localhost:3333/users
// Recurso: Qual entidade estamos acessando
// ex: users

// Request Param: parâmetros que vem na própria rota que identificam um recurso
// Request Body: parâmetros para criação/atualização de informações
// Query Param: parâmetros que vem na própria rota geralmente opcional para filtros, paginação

// O Express.js é um framework Node Cria abstrações de
// rotas, middlewares e muitas outras funções para
// facilitar a criação tanto de API's quanto SPA's
const app = express();

// Colocando um plugin para o express entender o corpo das nossas requisições em JSON
app.use(express.json());
app.use(cors());
app.use(routes);

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

app.use(errors());

app.listen(3333);