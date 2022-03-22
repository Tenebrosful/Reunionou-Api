import { BelongsTo, BelongsToMany, Column, DataType, Default, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { User } from "./User";
import { UserEvent } from "./UserEvent";

@Table({paranoid: true, tableName: "event", timestamps: true})
export class Event extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUIDV4)
  id: string;

  @Column(DataType.STRING(128))
  title: string;

  @Default(null)
  @Column(DataType.TEXT)
  description: string;

  @Column(DataType.STRING(256))
  address: string;

  @Column(DataType.DOUBLE)
  lat: number;

  @Column(DataType.DOUBLE)
  long: number;

  @Default(null)
  @ForeignKey(() => User)
  @Column(DataType.UUIDV4)
  owner_id: string;

  @BelongsTo(() => User, "owner_id")
  owner: User;

  @BelongsToMany(() => User, () => UserEvent)
  participants: User[];
}