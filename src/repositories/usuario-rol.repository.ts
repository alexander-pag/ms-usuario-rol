import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {UsuarioRol, UsuarioRolRelations} from '../models';

export class UsuarioRolRepository extends DefaultCrudRepository<
  UsuarioRol,
  typeof UsuarioRol.prototype._id,
  UsuarioRolRelations
> {
  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource,
  ) {
    super(UsuarioRol, dataSource);
  }
}
