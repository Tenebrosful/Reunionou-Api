import { Table, Model, Column, DataType, ForeignKey, CreatedAt, DeletedAt, UpdatedAt, Default } from "sequelize-typescript";
import { Event } from "./Event";
import { User } from "./User";

@Table({ tableName: "userevent" })
export class UserEvent extends Model {
  @ForeignKey(() => User)
  @Default(null)
  @Column(DataType.UUIDV4)
  user_id: string;

  @ForeignKey(() => Event)
  @Column(DataType.UUIDV4)
  event_id: string;

  @Default(null)
  @Column(DataType.STRING(128))
  username: string;

  @Column(DataType.BOOLEAN)
  comeToEvent: boolean;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}