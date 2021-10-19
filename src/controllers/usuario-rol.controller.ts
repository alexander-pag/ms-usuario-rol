import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody
} from '@loopback/rest';
import {
  Rol, Usuario
} from '../models';
import {UsuarioRepository} from '../repositories';

export class UsuarioRolController {
  constructor(
    @repository(UsuarioRepository) protected usuarioRepository: UsuarioRepository,
  ) { }

  @get('/usuario/{id}/rols', {
    responses: {
      '200': {
        description: 'Array of User has many Rol through UserRol',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Rol)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Rol>,
  ): Promise<Rol[]> {
    return this.usuarioRepository.rols(id).find(filter);
  }

  @post('/usuario/{id}/rols', {
    responses: {
      '200': {
        description: 'create a Rol model instance',
        content: {'application/json': {schema: getModelSchemaRef(Rol)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Usuario.prototype._id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Rol, {
            title: 'NewRolInUser',
            exclude: ['_id'],
          }),
        },
      },
    }) rol: Omit<Rol, '_id'>,
  ): Promise<Rol> {
    return this.usuarioRepository.rols(id).create(rol);
  }

  @patch('/usuario/{id}/rols', {
    responses: {
      '200': {
        description: 'User.Rol PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Rol, {partial: true}),
        },
      },
    })
    rol: Partial<Rol>,
    @param.query.object('where', getWhereSchemaFor(Rol)) where?: Where<Rol>,
  ): Promise<Count> {
    return this.usuarioRepository.rols(id).patch(rol, where);
  }

  @del('/usuario/{id}/rols', {
    responses: {
      '200': {
        description: 'User.Rol DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Rol)) where?: Where<Rol>,
  ): Promise<Count> {
    return this.usuarioRepository.rols(id).delete(where);
  }
}
