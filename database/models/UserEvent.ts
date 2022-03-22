import { Table, Model, Column, DataType, ForeignKey } from "sequelize-typescript";
import { Event } from "./Event";
import { User } from "./User";

@Table({paranoid: true, tableName: "userevent", timestamps: true})
export class UserEvent extends Model {
  @ForeignKey(() => User)
  @Column(DataType.UUIDV4)
  user_id: string;

  @ForeignKey(() => Event)
  @Column(DataType.UUIDV4)
  event_id: string;

  @Column(DataType.BOOLEAN)
  comeToEvent: boolean;
}