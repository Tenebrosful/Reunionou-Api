import { Column, CreatedAt, DataType, Default, DeletedAt, Model, PrimaryKey, Table, UpdatedAt } from "sequelize-typescript";

@Table({tableName: "userAccount"})
export class UserAccount extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUIDV4)
  id: string;

  @Column(DataType.STRING(128))
  login: string;

  @Column(DataType.STRING(300))
  password: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  isAdmin: boolean;

  @Default(DataType.NOW)
  @Column(DataType.DATE)
  last_connexion: Date;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}