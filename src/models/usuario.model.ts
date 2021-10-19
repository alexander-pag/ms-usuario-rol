import {Entity, hasMany, model, property} from '@loopback/repository';
import {Rol} from './rol.model';
import {UsuarioRol} from './usuario-rol.model';

@model()
export class Usuario extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  _id?: string;

  @property({
    type: 'string',
    required: true,
  })
  nombre: string;

  @property({
    type: 'string',
    required: true,
  })
  apellido: string;

  @property({
    type: 'string',
    required: true,
  })
  documento: string;

  @property({
    type: 'date',
    required: true,
  })
  fechaNacimiento: string;

  @property({
    type: 'string',
    required: true,
  })
  correo: string;

  @property({
    type: 'string',
    required: true,
  })
  celular: string;

  @property({
    type: 'number',
    default: 1,
  })
  estado?: number;

  @property({
    type: 'string',
    required: false,
  })
  clave?: string;

  @hasMany(() => Rol, {through: {model: () => UsuarioRol, keyFrom: 'id_usuario', keyTo: 'id_rol'}})
  rols: Rol[];

  constructor(data?: Partial<Usuario>) {
    super(data);
  }
}

export interface UsuarioRelations {
  // describe navigational properties here
}

export type UsuarioWithRelations = Usuario & UsuarioRelations;
