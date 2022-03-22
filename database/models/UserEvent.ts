import { Table, Model, Column, DataType, ForeignKey, CreatedAt, DeletedAt, UpdatedAt } from "sequelize-typescript";
import { Event } from "./Event";
import { User } from "./User";

@Table({ tableName: "userevent" })
export class UserEvent extends Model {
  @ForeignKey(() => User)
  @Column(DataType.UUIDV4)
  user_id: string;

  @ForeignKey(() => Event)
  @Column(DataType.UUIDV4)
  event_id: string;

  @Column(DataType.BOOLEAN)
  comeToEvent: boolean;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}