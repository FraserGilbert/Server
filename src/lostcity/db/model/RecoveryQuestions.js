import { Model } from 'objection';

export default class RecoveryQuestions extends Model {
	account_id;
    timestamp;
    question1;
    answer1;
    question2;
    answer2;
    question3;
    answer3;

	static get tableName() {
		return 'recovery_questions';
	}
}
