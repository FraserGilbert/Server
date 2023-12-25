import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type Account = {
    id: Generated<number>;
    username: string;
    password: string;
    recovery_email: string | null;
};
export type Friend = {
    account_id: number;
    username: number;
};
export type Hiscore = {
    table: number;
    account_id: number;
    value: number;
    extended_value: string | null;
};
export type Ignore = {
    account_id: number;
    username: number;
};
export type Session = {
    id: Generated<number>;
    account_id: number;
    timestamp: Generated<Timestamp>;
    ip: string;
};
export type DB = {
    Account: Account;
    Friend: Friend;
    Hiscore: Hiscore;
    Ignore: Ignore;
    Session: Session;
};
