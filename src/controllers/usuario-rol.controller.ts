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
  Rol, RolesUsuario, Usuario, UsuarioRol
} from '../models';
import {UsuarioRepository, UsuarioRolRepository} from '../repositories';

export class UsuarioRolController {
  constructor(
    @repository(UsuarioRepository) protected usuarioRepository: UsuarioRepository,
    @repository(UsuarioRolRepository) protected usuarioRolRepository: UsuarioRolRepository,
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


  @post('/usuario-rol', {
    responses: {
      '200': {
        description: 'create a Rol model instance',
        content: {'application/json': {schema: getModelSchemaRef(UsuarioRol)}},
      },
    },
  })
  async createUnUsuarioUnRol(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UsuarioRol, {
            title: 'New',
            exclude: ['_id'],
          })
        }
      }
    }) datos: Omit<UsuarioRol, '_id'>,
  ): Promise<UsuarioRol | null> {
    let registro = await this.usuarioRolRepository.create(datos);
    return registro
  }




  @post('/usuario-rols/{id}', {
    responses: {
      '200': {
        description: 'create a Rol model instance',
        content: {'application/json': {schema: getModelSchemaRef(UsuarioRol)}},
      },
    },
  })
  async createUnUsuarioMuchosRol(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RolesUsuario, {}),
        },
      },
    }) datos: RolesUsuario,
    @param.path.string('id') id_usuario: typeof Usuario.prototype._id,
  ): Promise<Boolean> {
    if (datos.roles.length > 0) {
      datos.roles.forEach(async (id_rol: string) => {
        let existe = await this.usuarioRolRepository.findOne({
          where: {
            id_usuario: id_usuario,
            id_rol: id_rol
          }
        })
        if (!existe) {
          this.usuarioRolRepository.create({
            id_usuario: id_usuario,
            id_rol: id_rol
          })
        }

      })
      return true
    }
    return false
  }
}


