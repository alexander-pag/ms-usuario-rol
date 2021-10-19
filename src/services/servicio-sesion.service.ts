import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {Configuracion as llaves} from '../llaves/config';
import {Usuario} from '../models';
const jwt = require('jsonwebtoken')

@injectable({scope: BindingScope.TRANSIENT})
export class ServicioSesionService {
  constructor(/* Add @inject to inject parameters */) { }

  GenerarToken(usuario: Usuario): string {
    let tk = jwt.sign({
      exp: llaves.tiempoVencimientoJWT,
      data: {
        nombreUsuario: usuario.correo,
        estado: usuario.estado
      }
    }, llaves.secretKey);
    console.log(tk);
    let dat = Math.floor(Date.now() / 1000)
    let da = (60 * 60 * 12)
    console.log("Su tiempo de token es ", dat, da)

    return tk;
  }

  VerificarTokenJWT(token: string) {
    try {
      let decoded = jwt.verify(token, llaves.secretKey);
      return decoded;
    } catch {
      return null;
    }
  }
}
