import { BelongsToMany, Column, CreatedAt, DataType, Default, DeletedAt, HasMany, IsEmail, Model, PrimaryKey, Table, UpdatedAt } from "sequelize-typescript";
import { Comment } from "./Comment";
import { Event } from "./Event";
import { UserEvent } from "./UserEvent";

@Table({tableName: "user"})
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
  default_event_mail: string;

  @Default(null)
  @Column(DataType.DATE)
  last_connexion: Date;

  @HasMany(() => Event)
  ownedEvents: Event[];

  @HasMany(() => Comment)
  comments: Comment[];

  @BelongsToMany(() => Event, () => UserEvent)
  events: Event[] & {UserEvent: UserEvent};

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}