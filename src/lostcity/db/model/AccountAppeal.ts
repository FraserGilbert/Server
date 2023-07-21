import { Model } from 'objection';

export default class AccountAppeal extends Model {
	account_id: BigInt;
    timestamp: Date;
    thread: string;

	static get tableName() {
		return 'account_appeal';
	}
}
