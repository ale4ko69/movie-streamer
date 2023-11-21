import config from '#config/config.js'
import Datastore from 'nedb-promises';
const { nedb: {path: dbPath} } = config
import path from 'path'
import { cwd } from 'process';

const uri = `${path.resolve(cwd(), dbPath)}`;

export interface IDatabase {
    movieInfo: any
}

const database: IDatabase = {
    movieInfo: Datastore.create({ filename: uri, autoload: true })
};

export const db = database
