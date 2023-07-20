import { Model } from 'objection';

export default class Appeals extends Model {
	account_id;
    timestamp;
    thread;

	static get tableName() {
		return 'appeals';
	}
}
