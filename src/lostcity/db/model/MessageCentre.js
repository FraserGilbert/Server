import { Model } from 'objection';

export default class MessageCentre extends Model {
	account_id;
    timestamp;
    message;

	static get tableName() {
		return 'message_centre';
	}
}
