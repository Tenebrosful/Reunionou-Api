import { BelongsToMany, Column, DataType, Default, HasMany, IsEmail, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Event } from "./Event";
import { UserEvent } from "./UserEvent";

@Table({paranoid: true, tableName: "user", timestamps: true})
export class User extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUIDV4)
  id: string;

  @Column(DataType.STRING(128))
  username: string;

  @Column(DataType.STRING(300))
  password: string;

  @IsEmail
  @Column(DataType.STRING(256))
  default_event_mail: string

  @Default(null)
  @Column(DataType.DATE)
  last_connexion: Date;

  @HasMany(() => Event)
  ownedEvents: Event[];

  @BelongsToMany(() => Event, () => UserEvent)
  events: Event[];
}