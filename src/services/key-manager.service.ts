import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {CambioClave, User} from '../models';
import {UserRepository} from '../repositories';
var generator = require('generate-password');
var CryptoJS = require("crypto-js");

@injectable({scope: BindingScope.TRANSIENT})
export class KeyManagerService {
  constructor(@repository(UserRepository)
  public usuarioRepository: UserRepository
  ) { }

  /*
   * Add service methods here
   */

  async CambiarCLave(credencialesClave: CambioClave): Promise<boolean> {
    let usuario = await this.usuarioRepository.findOne({
      where: {
        _id: credencialesClave.id_user,
        clave: credencialesClave.clave_actual
      }
    });
    if (usuario) {
      usuario.clave = credencialesClave.nueva_clave;
      await this.usuarioRepository.updateById(credencialesClave.id_user, usuario)
      return true;
    } else {
      return false;
    }
  }

  async RecuperarClave(email: string): Promise<User | null> {
    let usuario = await this.usuarioRepository.findOne({
      where: {
        email: email
      }
    });
    if (usuario) {
      let clave = this.CrearClaveAleatoria();
      usuario.clave = this.CifrarTexto(clave);
      await this.usuarioRepository.updateById(usuario._id, usuario)
      return usuario
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
