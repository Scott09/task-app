require('dotenv').config()
const sgMail = require('@sendgrid/mail');
const companyEmail = 'scottappleton09@gmail.com';

sgMail.setApiKey(process.env.SENDGRID_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: companyEmail,
    subject: 'Welcome! Thanks for joining',
    text: `Welcome to the app ${name}. Let me know how you get along with the app!`
  })
};


const sendCancellationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: companyEmail,
    subject: 'Account Cancelled',
    text: `Hey ${name}. We're sorry to hear about your account cancellation. Was there anything we could have done better? (insert survey or textbox here`
  })
}

module.exports = {
  sendWelcomeEmail,
  sendCancellationEmail
};

