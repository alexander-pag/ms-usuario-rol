import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {Configuracion} from '../llaves/config';
import {Notificacion, NotificacionSms} from '../models';
const fetch = require('node-fetch');

@injectable({scope: BindingScope.TRANSIENT})
export class NotificacionesService {
  constructor(/* Add @inject to inject parameters */) { }

  /*
   * Add service methods here
   */

  EnviarCorreo(datos: Notificacion) {
    let url = `${Configuracion.urlCorreo}?${Configuracion.hashArg}=${Configuracion.hashNotificacion}&${Configuracion.destinoArg}=${datos.destinatario}&${Configuracion.asuntoArg}=${datos.asunto}&${Configuracion.mensajeArg}=${datos.mensaje}`;
    fetch(url)
      .then((res: any) => {
        console.log(res.text());

      })
  }


  EnviarSms(datos: NotificacionSms) {
    let url = `${Configuracion.urlSms}?${Configuracion.hashArg}=${Configuracion.hashNotificacion}&${Configuracion.destinoArg}=${datos.destinatario}&${Configuracion.mensajeArg}=${datos.mensaje}`
    fetch(url)
      .then((res: any) => {
        console.log(res.text());

      })
  }


}
