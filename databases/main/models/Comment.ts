import { Table, Model, Column, DataType, Default, PrimaryKey, ForeignKey, BelongsTo, CreatedAt, DeletedAt, UpdatedAt, IsUrl } from "sequelize-typescript";
import { Event } from "./Event";
import { User } from "./User";

@Table({ tableName: "comment" })
export class Comment extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUIDV4)
  id: string;

  @ForeignKey(() => Event)
  @Column(DataType.UUIDV4)
  event_id: string;

  @BelongsTo(() => Event)
  event: Event;

  @ForeignKey(() => User)
  @Column(DataType.UUIDV4)
  user_id: string;

  @BelongsTo(() => User)
  author: User;

  @Default(null)
  @Column(DataType.TEXT)
  message: string;

  @IsUrl
  @Default(null)
  @Column(DataType.STRING(2038))
  media: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}