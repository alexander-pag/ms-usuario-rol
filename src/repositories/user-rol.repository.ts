import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {UserRol, UserRolRelations} from '../models';

export class UserRolRepository extends DefaultCrudRepository<
  UserRol,
  typeof UserRol.prototype._id,
  UserRolRelations
> {
  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource,
  ) {
    super(UserRol, dataSource);
  }
}
