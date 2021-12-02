const sgMail = require('@sendgrid/mail')
const Mailgen = require('mailgen')
require('dotenv').config()

const createEmailBody = (verifyToken, username) => {
  const mailGenerator = new Mailgen({
    theme: 'default',
    product: {
      // Appears in header & footer of e-mails
      name: 'phonebook',
      link: 'http://localhost:3000/',
    },
  })
  const emailTemp = {
    body: {
      name: username,
      intro: "Welcome to PhoneBook! We're very excited to have you on board.",
      action: {
        instructions: 'To get started with PhoneBook, please click here:',
        button: {
          color: '#22BC66', // Optional action button color
          text: 'Confirm your account',
          link: `http://localhost:3000/api/users/verify/${verifyToken}`,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  }
  return mailGenerator.generate(emailTemp)
}

const sendEmail = async (verifyToken, email, username) => {
  console.log('enter')
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  const emailBody = createEmailBody(verifyToken, username)
  const msg = {
    to: email,
    from: 'dnbdimka@gmail.com',
    subject: 'Verification your email',
    html: emailBody,
  }

  await sgMail.send(msg)
}

module.exports = { sendEmail }
