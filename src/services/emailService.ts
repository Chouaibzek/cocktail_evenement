import emailjs from '@emailjs/browser'

const SERVICE_ID               = import.meta.env.VITE_EMAILJS_SERVICE_ID as string
const TEMPLATE_RESERVATION     = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_RESERVATION as string
const TEMPLATE_CONFIRMATION    = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_CONFIRMATION as string
const PUBLIC_KEY               = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string

export interface ReservationEmailParams {
  client_nom: string
  client_prenom: string
  client_email: string
  client_telephone: string
  lieu_evenement: string
  type_evenement: string
  event_date: string
  nb_invites: number
  message?: string
}

/** Email reçu par Sara avec toutes les infos de la cliente */
export async function sendReservationEmail(params: ReservationEmailParams) {
  return emailjs.send(
    SERVICE_ID,
    TEMPLATE_RESERVATION,
    {
      to_email:         'chouaibzekhnini@gmail.com',
      from_name:        `${params.client_prenom} ${params.client_nom}`,
      client_email:     params.client_email,
      client_telephone: params.client_telephone,
      lieu_evenement:   params.lieu_evenement,
      type_evenement:   params.type_evenement,
      event_date:       params.event_date,
      nb_invites:       params.nb_invites,
      message:          params.message ?? '',
    },
    PUBLIC_KEY,
  )
}

/** Email de confirmation reçu par la cliente */
export async function sendConfirmationEmail(params: ReservationEmailParams) {
  return emailjs.send(
    SERVICE_ID,
    TEMPLATE_CONFIRMATION,
    {
      to_email:       params.client_email,
      prenom:         params.client_prenom,
      lieu_evenement: params.lieu_evenement,
      type_evenement: params.type_evenement,
      event_date:     params.event_date,
      nb_invites:     params.nb_invites,
      message:        params.message ?? '',
    },
    PUBLIC_KEY,
  )
}
