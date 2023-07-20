import { Model } from 'objection';

export default class LoginHistory extends Model {
	account_id;
    timestamp;
    ip_address;
    world_id;

	static get tableName() {
		return 'login_history';
	}
}
