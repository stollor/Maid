import { Maid } from '../index';
import { Data } from './data';
import { Database } from './database';

declare module '../index' {
	interface Maid {
		Data: typeof Data;
		database: Database;
	}
}

Maid.prototype.database = Database.instance = new Database();
