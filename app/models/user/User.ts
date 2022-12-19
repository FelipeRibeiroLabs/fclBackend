import {
  DataType,
  Column,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";

type Orbies = {  
  id: number;
  name: string;
  description: string;
  thumbnail: boolean;
  type: string;
}

@Table
export class User extends Model {
  @PrimaryKey
  @Column(DataType.STRING)
  address!: string;

  @Column(DataType.STRING)
  email?: string | null;
    

  @Column(DataType.ARRAY(DataType.STRING))
  orbiesData?: Orbies[];
}
