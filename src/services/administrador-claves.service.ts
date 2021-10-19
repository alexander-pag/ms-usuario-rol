import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {CambioClave, Usuario} from '../models';
import {UsuarioRepository} from '../repositories';
var generator = require('generate-password');
var CryptoJS = require("crypto-js");

@injectable({scope: BindingScope.TRANSIENT})
export class AdministradorClavesService {
  constructor(@repository(UsuarioRepository)
  public usuarioRepository: UsuarioRepository
  ) { }

  /*
   * Add service methods here
   */

  async CambiarCLave(credencialesClave: CambioClave): Promise<Usuario | null> {
    let usuario = await this.usuarioRepository.findOne({
      where: {
        _id: credencialesClave.id_usuario,
        clave: credencialesClave.clave_actual
      }
    });
    if (usuario) {
      usuario.clave = credencialesClave.nueva_clave;
      await this.usuarioRepository.updateById(credencialesClave.id_usuario, usuario)
      return usuario;
    } else {
      return null;
    }
  }


  CrearClaveAleatoria(): string {
    let password = generator.generate({
      length: 8,
      number: true,
      uppercase: true
    })
    return password
  }

  CifrarTexto(texto: string) {
    let textoCifrado = CryptoJS.MD5(texto).toString();
    return textoCifrado;
  }
}
