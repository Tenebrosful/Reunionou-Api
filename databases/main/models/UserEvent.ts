import { Table, Model, Column, DataType, ForeignKey, CreatedAt, DeletedAt, UpdatedAt, Default, Unique } from "sequelize-typescript";
import { Event } from "./Event";
import { User } from "./User";

@Table({ tableName: "userevent" })
export class UserEvent extends Model {
  @ForeignKey(() => User)
  @Unique("user_event")
  @Default(null)
  @Column(DataType.UUIDV4)
  user_id: string;

  @ForeignKey(() => Event)
  @Unique("user_event")
  @Unique("username_event")
  @Column(DataType.UUIDV4)
  event_id: string;

  @Unique("username_event")
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