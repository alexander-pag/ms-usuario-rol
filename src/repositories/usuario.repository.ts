import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasManyThroughRepositoryFactory, repository} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Rol, Usuario, UsuarioRelations, UsuarioRol} from '../models';
import {RolRepository} from './rol.repository';
import {UsuarioRolRepository} from './usuario-rol.repository';

export class UsuarioRepository extends DefaultCrudRepository<
  Usuario,
  typeof Usuario.prototype._id,
  UsuarioRelations
> {

  public readonly rols: HasManyThroughRepositoryFactory<Rol, typeof Rol.prototype._id,
    UsuarioRol,
    typeof Usuario.prototype._id
  >;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource, @repository.getter('UsuarioRolRepository') protected userRolRepositoryGetter: Getter<UsuarioRolRepository>, @repository.getter('RolRepository') protected rolRepositoryGetter: Getter<RolRepository>,
  ) {
    super(Usuario, dataSource);
    this.rols = this.createHasManyThroughRepositoryFactoryFor('rols', rolRepositoryGetter, userRolRepositoryGetter,);
    this.registerInclusionResolver('rols', this.rols.inclusionResolver);
  }
}
