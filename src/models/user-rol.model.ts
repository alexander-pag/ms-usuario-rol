import {Entity, model, property} from '@loopback/repository';

@model()
export class UserRol extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  _id?: string;

  @property({
    type: 'string',
  })
  id_user?: string;

  @property({
    type: 'string',
  })
  id_rol?: string;

  constructor(data?: Partial<UserRol>) {
    super(data);
  }
}

export interface UserRolRelations {
  // describe navigational properties here
}

export type UserRolWithRelations = UserRol & UserRolRelations;
