import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {UserRol} from '../models';
import {UserRolRepository} from '../repositories';

export class RolUserController {
  constructor(
    @repository(UserRolRepository)
    public userRolRepository : UserRolRepository,
  ) {}

  @post('/rol-user')
  @response(200, {
    description: 'UserRol model instance',
    content: {'application/json': {schema: getModelSchemaRef(UserRol)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserRol, {
            title: 'NewUserRol',
            exclude: ['_id'],
          }),
        },
      },
    })
    userRol: Omit<UserRol, '_id'>,
  ): Promise<UserRol> {
    return this.userRolRepository.create(userRol);
  }

  @get('/rol-user/count')
  @response(200, {
    description: 'UserRol model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(UserRol) where?: Where<UserRol>,
  ): Promise<Count> {
    return this.userRolRepository.count(where);
  }

  @get('/rol-user')
  @response(200, {
    description: 'Array of UserRol model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(UserRol, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(UserRol) filter?: Filter<UserRol>,
  ): Promise<UserRol[]> {
    return this.userRolRepository.find(filter);
  }

  @patch('/rol-user')
  @response(200, {
    description: 'UserRol PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserRol, {partial: true}),
        },
      },
    })
    userRol: UserRol,
    @param.where(UserRol) where?: Where<UserRol>,
  ): Promise<Count> {
    return this.userRolRepository.updateAll(userRol, where);
  }

  @get('/rol-user/{id}')
  @response(200, {
    description: 'UserRol model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(UserRol, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(UserRol, {exclude: 'where'}) filter?: FilterExcludingWhere<UserRol>
  ): Promise<UserRol> {
    return this.userRolRepository.findById(id, filter);
  }

  @patch('/rol-user/{id}')
  @response(204, {
    description: 'UserRol PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserRol, {partial: true}),
        },
      },
    })
    userRol: UserRol,
  ): Promise<void> {
    await this.userRolRepository.updateById(id, userRol);
  }

  @put('/rol-user/{id}')
  @response(204, {
    description: 'UserRol PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() userRol: UserRol,
  ): Promise<void> {
    await this.userRolRepository.replaceById(id, userRol);
  }

  @del('/rol-user/{id}')
  @response(204, {
    description: 'UserRol DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.userRolRepository.deleteById(id);
  }
}
