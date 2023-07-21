import { Model } from 'objection';

export default class Account extends Model {
	id: BigInt;
	username: string;
	password: string;
	staff_modlevel: number;
    membership: Date;

	email: string;
    recovery1: string;
    recovery2: string;
    recovery3: string;
    recovery_set: Date;

    world_id: number;
    last_login: Date;

	static get tableName() {
		return 'account';
	}
}
