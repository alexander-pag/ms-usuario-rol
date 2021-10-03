import {service} from '@loopback/core';
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
import {CambioClave, Credentials, User} from '../models';
import {UserRepository} from '../repositories';
import {KeyManagerService} from '../services';


export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @service(KeyManagerService)
    public servicioClaves: KeyManagerService
  ) { }

  @post('/users')
  @response(200, {
    description: 'User model instance',
    content: {'application/json': {schema: getModelSchemaRef(User)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUser',
            exclude: ['_id'],
          }),
        },
      },
    })
    user: Omit<User, '_id'>,
  ): Promise<User> {
    let clave = this.servicioClaves.CrearClaveAleatoria();
    console.log(clave)
    let claveCifrada = this.servicioClaves.CifrarTexto(clave);
    user.clave = claveCifrada;
    let usuarioCreado = await this.userRepository.create(user);
    if (usuarioCreado) {
      // Enviar clave por correo electrónico
    }
    return usuarioCreado;
  }

  @get('/users/count')
  @response(200, {
    description: 'User model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(User) where?: Where<User>,
  ): Promise<Count> {
    return this.userRepository.count(where);
  }

  @get('/users')
  @response(200, {
    description: 'Array of User model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(User, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(User) filter?: Filter<User>,
  ): Promise<User[]> {
    return this.userRepository.find(filter);
  }

  @patch('/users')
  @response(200, {
    description: 'User PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
    @param.where(User) where?: Where<User>,
  ): Promise<Count> {
    return this.userRepository.updateAll(user, where);
  }

  @get('/users/{id}')
  @response(200, {
    description: 'User model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(User, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(User, {exclude: 'where'}) filter?: FilterExcludingWhere<User>
  ): Promise<User> {
    return this.userRepository.findById(id, filter);
  }

  @patch('/users/{id}')
  @response(204, {
    description: 'User PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
  ): Promise<void> {
    await this.userRepository.updateById(id, user);
  }

  @put('/users/{id}')
  @response(204, {
    description: 'User PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() user: User,
  ): Promise<void> {
    await this.userRepository.replaceById(id, user);
  }

  @del('/users/{id}')
  @response(204, {
    description: 'User DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.userRepository.deleteById(id);
  }


  /**
   * ---------- Métodos Adicionales ------------
   */
  @post('/identificar-usuario')
  @response(200, {
    description: 'Identificación de usuarios',
    content: {'application/json': {schema: getModelSchemaRef(Credentials)}},
  })
  async identificarUsuario(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Credentials, {
            title: 'Identificar Usuario'
          }),
        },
      },
    })
    credenciales: Credentials,
  ): Promise<object | null> {
    let usuario = await this.userRepository.findOne({
      where: {
        email: credenciales.usuario,
        clave: credenciales.clave
      }
    });
    if (usuario) {
      // generar token y agregarlo a la respuesta.
    }
    return usuario;
  }


  @post('/cambiar-clave')
  @response(200, {
    description: 'Identificación de usuarios',
    content: {'application/json': {schema: getModelSchemaRef(CambioClave)}},
  })
  async cambiarClave(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CambioClave, {
            title: 'Cambiar clave de usuario'
          }),
        },
      },
    })
    cambioClave: CambioClave,
  ): Promise<Boolean> {
    let respuesta = await this.servicioClaves.CambiarCLave(cambioClave);
    if (respuesta) {
      // se notificará al usuario por correo
    }
    return respuesta;
  }



  @post('/recuperar-clave')
  @response(200, {
    description: 'Identificación de usuarios',
    content: {'application/json': {schema: {}}},
  })
  async recuperarClave(
    @requestBody({
      content: {
        'application/json': {
        },
      },
    })
    email: string,
  ): Promise<User | null> {
    let usuario = await this.servicioClaves.RecuperarClave(email);
    if (usuario) {
      // notificar al usuario por correo con su nueva clave
    }
    return usuario;
  }
}
