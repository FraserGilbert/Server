import { Model } from 'objection';

export default class World extends Model {
	id: BigInt;
    address: string;
    port_offset: number;
    members: boolean;
    secret: string; // login server <-> world server secret

	static get tableName() {
		return 'world';
	}
}
