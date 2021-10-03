import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyThroughRepositoryFactory} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {User, UserRelations, Rol, UserRol} from '../models';
import {UserRolRepository} from './user-rol.repository';
import {RolRepository} from './rol.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype._id,
  UserRelations
> {

  public readonly rols: HasManyThroughRepositoryFactory<Rol, typeof Rol.prototype._id,
          UserRol,
          typeof User.prototype._id
        >;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource, @repository.getter('UserRolRepository') protected userRolRepositoryGetter: Getter<UserRolRepository>, @repository.getter('RolRepository') protected rolRepositoryGetter: Getter<RolRepository>,
  ) {
    super(User, dataSource);
    this.rols = this.createHasManyThroughRepositoryFactoryFor('rols', rolRepositoryGetter, userRolRepositoryGetter,);
    this.registerInclusionResolver('rols', this.rols.inclusionResolver);
  }
}
