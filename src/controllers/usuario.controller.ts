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
import {Configuracion} from '../llaves/config';
import {CambioClave, Credenciales, CredencialesRecuperarClave, Notificacion, NotificacionSms, Usuario} from '../models';
import {UsuarioRepository} from '../repositories';
import {AdministradorClavesService, NotificacionesService, ServicioSesionService} from '../services';


export class UsuarioController {
  constructor(
    @repository(UsuarioRepository)
    public UsuarioRepository: UsuarioRepository,
    @service(AdministradorClavesService)
    public servicioClaves: AdministradorClavesService,
    @service(NotificacionesService)
    public servicioNotificaciones: NotificacionesService,
    @service(ServicioSesionService)
    public servicioSesion: ServicioSesionService,

  ) { }

  @post('/usuario')
  @response(200, {
    description: 'Creacion de un usuario',
    content: {'application/json': {schema: getModelSchemaRef(Usuario)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usuario, {
            title: 'NewUsuario',
            exclude: ['_id'],
          }),
        },
      },
    })
    Usuario: Omit<Usuario, '_id'>,
  ): Promise<Usuario> {
    let clave = this.servicioClaves.CrearClaveAleatoria();
    console.log(clave)
    let claveCifrada = this.servicioClaves.CifrarTexto(clave);
    Usuario.clave = claveCifrada;
    let usuarioCreado = await this.UsuarioRepository.create(Usuario);
    if (usuarioCreado) {
      let datos = new Notificacion();
      datos.destinatario = Usuario.correo;
      datos.asunto = Configuracion.asuntoUsuarioCreado;
      datos.mensaje = `${Configuracion.saludo} <b> ${Usuario.nombre} </b> <br /> <br />${Configuracion.mensajeUsuarioCreado} <span> <b> ${clave} </b> <span>`;
      this.servicioNotificaciones.EnviarCorreo(datos);
    }
    return usuarioCreado;
  }

  @get('/usuario/count')
  @response(200, {
    description: 'Obtener un usuario',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Usuario) where?: Where<Usuario>,
  ): Promise<Count> {
    return this.UsuarioRepository.count(where);
  }

  @get('/usuario')
  @response(200, {
    description: 'Obtener todos los usuarios',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Usuario, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Usuario) filter?: Filter<Usuario>,
  ): Promise<Usuario[]> {
    return this.UsuarioRepository.find(filter);
  }

  @patch('/usuario')
  @response(200, {
    description: 'Usuario editado correctamente',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usuario, {partial: true}),
        },
      },
    })
    Usuario: Usuario,
    @param.where(Usuario) where?: Where<Usuario>,
  ): Promise<Count> {
    return this.UsuarioRepository.updateAll(Usuario, where);
  }

  @get('/usuario/{id}')
  @response(200, {
    description: 'Obtener datos de un usuario por id',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Usuario, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Usuario, {exclude: 'where'}) filter?: FilterExcludingWhere<Usuario>
  ): Promise<Usuario> {
    return this.UsuarioRepository.findById(id, filter);
  }

  @patch('/usuario/{id}')
  @response(204, {
    description: 'Usuario editado correctamente',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usuario, {partial: true}),
        },
      },
    })
    Usuario: Usuario,
  ): Promise<void> {
    await this.UsuarioRepository.updateById(id, Usuario);
  }

  @put('/usuario/{id}')
  @response(204, {
    description: 'Usuario PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() Usuario: Usuario,
  ): Promise<void> {
    await this.UsuarioRepository.replaceById(id, Usuario);
  }

  @del('/usuario/{id}')
  @response(204, {
    description: 'Usuario eliminado correctamente',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.UsuarioRepository.deleteById(id);
  }


  /**
   * ---------- Métodos Adicionales ------------
   */
  @post('/identificar-usuario')
  @response(200, {
    description: 'Identificación de usuarios',
    content: {'application/json': {schema: getModelSchemaRef(Credenciales)}},
  })
  async identificarUsuario(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Credenciales, {
            title: 'Identificar Usuario'
          }),
        },
      },
    })
    credenciales: Credenciales,
  ): Promise<object | null> {
    let usuario = await this.UsuarioRepository.findOne({
      where: {
        correo: credenciales.usuario,
        clave: credenciales.clave
      }
    });
    if (usuario) {
      // generar un token
      let token = this.servicioSesion.GenerarToken(usuario);
      return {
        usuario: {
          nombreUsuario: usuario.correo,
          estado: usuario.estado
        },
        tk: token

      };
    } else {
      return null
    }
  }




  @post("/cambiar-clave", {
    responses: {
      '200': {
        description: "Cambio de clave de usuarios"
      }
    }
  })
  async cambiarClave(
    @requestBody() datos: CambioClave
  ): Promise<Boolean> {
    let usuario = await this.UsuarioRepository.findById(datos.id_usuario)
    if (usuario) {
      if (usuario.clave == datos.clave_actual) {
        usuario.clave = datos.nueva_clave;
        console.log(datos.nueva_clave);
        await this.UsuarioRepository.updateById(datos.id_usuario, usuario)
        let notificacionSms = new NotificacionSms()
        notificacionSms.destinatario = usuario.celular
        notificacionSms.mensaje = `${Configuracion.saludo} ${usuario.nombre} ${Configuracion.mensajeCambioClave}`
        this.servicioNotificaciones.EnviarSms(notificacionSms)
        return true;
      }
      else {
        return false
      }
    }
    return false
  }



  @post("/recuperar-clave", {
    responses: {
      '200': {
        description: "Recuperación de clave de usuarios"
      }
    }
  })
  async recuperarClave(
    @requestBody() credencialRecuperar: CredencialesRecuperarClave
  ): Promise<Boolean> {
    let usuario = await this.UsuarioRepository.findOne({
      where: {
        correo: credencialRecuperar.correo
      }
    })
    if (usuario) {
      let clave = this.servicioClaves.CrearClaveAleatoria();
      console.log(clave);
      let claveCifrada = this.servicioClaves.CifrarTexto(clave);
      console.log(claveCifrada);
      usuario.clave = claveCifrada
      await this.UsuarioRepository.updateById(usuario._id, usuario)
      let notificacionSms = new NotificacionSms();
      notificacionSms.destinatario = usuario.celular
      notificacionSms.mensaje = `${Configuracion.saludo} ${usuario.nombre} ${Configuracion.mensajeRecuperarClave} ${clave}`
      this.servicioNotificaciones.EnviarSms(notificacionSms);
      return true;

    }
    return false;
  }

}

