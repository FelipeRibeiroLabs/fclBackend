import { User } from "@models/user/User";
import {
  DataType,
  Column,
  Model,
  PrimaryKey,
  Table,
  HasOne,
  ForeignKey,
} from "sequelize-typescript";

@Table
export class Orbies extends Model {
  @PrimaryKey
  @Column(DataType.STRING)
  id!: number;

  @Column(DataType.STRING)
  name!: string;

  @Column(DataType.STRING)
  description!: string;

  @Column(DataType.BOOLEAN)
  thumbnail!: boolean;

  @Column(DataType.STRING)
  type!: string;
  
  @ForeignKey(() => User)
  @Column(DataType.STRING)
  user!: User;
}
