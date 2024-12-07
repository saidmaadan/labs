import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendNewsletter = async ({
  from,
  to,
  subject,
  react,
}) => {
  try {
    const data = await resend.emails.send({
      from,
      to,
      subject,
      react,
    })
    return { success: true, data }
  } catch (error) {
    console.error('Error sending newsletter:', error)
    return { success: false, error: error.message }
  }
}

export const sendTransactionalEmail = async ({
  from,
  to,
  subject,
  react,
}) => {
  try {
    const data = await resend.emails.send({
      from,
      to,
      subject,
      react,
    })
    return { success: true, data }
  } catch (error) {
    console.error('Error sending transactional email:', error)
    return { success: false, error: error.message }
  }
}

export default resend
