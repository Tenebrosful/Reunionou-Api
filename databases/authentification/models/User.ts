import { Column, CreatedAt, DataType, Default, DeletedAt, Model, PrimaryKey, Table, UpdatedAt } from "sequelize-typescript";

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

  @Default(false)
  @Column(DataType.BOOLEAN)
  isAdmin: boolean;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}