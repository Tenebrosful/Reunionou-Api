import { BelongsToMany, Column, CreatedAt, DataType, Default, DeletedAt, HasMany, IsEmail, IsUrl, Model, PrimaryKey, Table, UpdatedAt } from "sequelize-typescript";
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

  @IsEmail
  @Default(null)
  @Column(DataType.STRING(256))
  default_event_mail: string;

  @IsUrl
  @Default("https://assets.stickpng.com/thumbs/585e4bf3cb11b227491c339a.png")
  @Column(DataType.STRING(2083))
  profile_image_url: string;

  @HasMany(() => Event)
  ownedEvents: Event[];

  @HasMany(() => Comment)
  comments: Comment[];

  @BelongsToMany(() => Event, () => UserEvent)
  events: (Event & {UserEvent: UserEvent})[];

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}