import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, param, patch, post, put, requestBody,
  response
} from '@loopback/rest';
import {UsuarioRol} from '../models';
import {UsuarioRolRepository} from '../repositories';

export class RolUsuarioController {
  constructor(
    @repository(UsuarioRolRepository)
    public usuarioRolRepository: UsuarioRolRepository,
  ) { }

  @post('/rol-user')
  @response(200, {
    description: 'UserRol model instance',
    content: {'application/json': {schema: getModelSchemaRef(UsuarioRol)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UsuarioRol, {
            title: 'NewUserRol',
            exclude: ['_id'],
          }),
        },
      },
    })
    usuarioRol: Omit<UsuarioRol, '_id'>,
  ): Promise<UsuarioRol> {
    return this.usuarioRolRepository.create(usuarioRol);
  }

  @get('/rol-user/count')
  @response(200, {
    description: 'UserRol model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(UsuarioRol) where?: Where<UsuarioRol>,
  ): Promise<Count> {
    return this.usuarioRolRepository.count(where);
  }

  @get('/rol-user')
  @response(200, {
    description: 'Array of UserRol model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(UsuarioRol, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(UsuarioRol) filter?: Filter<UsuarioRol>,
  ): Promise<UsuarioRol[]> {
    return this.usuarioRolRepository.find(filter);
  }

  @patch('/rol-usuario')
  @response(200, {
    description: 'UserRol PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UsuarioRol, {partial: true}),
        },
      },
    })
    usuarioRol: UsuarioRol,
    @param.where(UsuarioRol) where?: Where<UsuarioRol>,
  ): Promise<Count> {
    return this.usuarioRolRepository.updateAll(usuarioRol, where);
  }

  @get('/rol-user/{id}')
  @response(200, {
    description: 'UserRol model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(UsuarioRol, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(UsuarioRol, {exclude: 'where'}) filter?: FilterExcludingWhere<UsuarioRol>
  ): Promise<UsuarioRol> {
    return this.usuarioRolRepository.findById(id, filter);
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
          schema: getModelSchemaRef(UsuarioRol, {partial: true}),
        },
      },
    })
    usuarioRol: UsuarioRol,
  ): Promise<void> {
    await this.usuarioRolRepository.updateById(id, usuarioRol);
  }

  @put('/rol-user/{id}')
  @response(204, {
    description: 'UserRol PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() usuarioRol: UsuarioRol,
  ): Promise<void> {
    await this.usuarioRolRepository.replaceById(id, usuarioRol);
  }

  @del('/rol-user/{id}')
  @response(204, {
    description: 'UserRol DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.usuarioRolRepository.deleteById(id);
  }
}
