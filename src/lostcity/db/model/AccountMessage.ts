import { Model } from 'objection';

export default class AccountMessage extends Model {
	account_id: BigInt;
    timestamp: Date;
    message: string;

	static get tableName() {
		return 'account_message';
	}
}
