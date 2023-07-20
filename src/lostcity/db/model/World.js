import { Model } from 'objection';

export default class World extends Model {
	id;
    address;
    port_offset;
    location;
    members;
    secret; // login server <-> world server secret

	static get tableName() {
		return 'world';
	}
}
