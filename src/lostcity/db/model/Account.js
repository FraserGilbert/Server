import { Model } from 'objection';

export default class Account extends Model {
	id;
	email;
	username;
	password;
	staff_modlevel;
    membership;

	static get tableName() {
		return 'account';
	}
}
