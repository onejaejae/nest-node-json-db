import { IBaseEntity } from '../common/entity.type';

export interface IUser extends IBaseEntity {
  email: string;
  password: string;
  refreshToken: string;
}
