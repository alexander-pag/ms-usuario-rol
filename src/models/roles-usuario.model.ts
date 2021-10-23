import {Model, model, property} from '@loopback/repository';

@model()
export class RolesUsuario extends Model {
  @property({
    type: 'array',
    itemType: 'string',
    required: true,
  })
  roles: string[];


  constructor(data?: Partial<RolesUsuario>) {
    super(data);
  }
}

export interface RolesUsuarioRelations {
  // describe navigational properties here
}

export type RolesUsuarioWithRelations = RolesUsuario & RolesUsuarioRelations;
