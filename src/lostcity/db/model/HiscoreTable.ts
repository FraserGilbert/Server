import { Model } from 'objection';

export default class HiscoreTable extends Model {
    account_id: number;
    stat: number;
    exp: number;

	static get tableName() {
		return 'hiscore_table';
	}
}
