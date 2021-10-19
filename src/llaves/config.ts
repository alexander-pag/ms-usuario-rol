export namespace Configuracion {
  export const mensajeCambioClave = "Se ha modificado tu contraseña en el sistema"
  export const mensajeRecuperarClave = "Su nueva contraseña solicitada es: "
  export const asuntoUsuarioCreado = "Registro en la plataforma"
  export const mensajeUsuarioCreado = "Se ha registrado tu correo electrónico en la plataforma, tu correo servirá como usuario y tu contraseña es: "
  export const hashNotificacion = "dXUyW6uvq6"
  export const urlCorreo = "http://localhost:5000/correo"
  export const urlSms = "http://localhost:5000/enviar-texto"
  export const asuntoCambioClave = "Cambio de contraseña"
  export const saludo = "Hola"
  export const destinoArg = "destino"
  export const asuntoArg = "asunto"
  export const mensajeArg = "mensaje"
  export const hashArg = "hash"
  export const secretKey = "pjcprog3"
  export const tiempoVencimientoJWT = Math.floor(Date.now() / 1000) + (60 * 60 * 12);
}
