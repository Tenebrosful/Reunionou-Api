import { Column, DataType, Default, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({paranoid: true, tableName: "admin", timestamps: true})
export class Admin extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUIDV4)
  id: string;

  @Column(DataType.STRING(128))
  username: string;

  @Column(DataType.STRING(300))
  password: string;  
}