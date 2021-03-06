/// <reference types="cypress" />

const path = require('path')
const fs = require('fs')

module.exports = (on, config) => {
  
  on('task', {

    message(word) {
      console.log(word)
      return null
    },

    async sendHintEmail({ screenshot, hint }) {
      console.log('sending hint %s', hint)
      const screenshotPath = path.join(config.screenshotsFolder, screenshot)
      console.log('screenshotPath', screenshotPath)

      if (!process.env.SENDGRID_API_KEY) {
        console.error('Missing SENDGRID_API_KEY')
        return null
      }

      // https://docs.sendgrid.com/for-developers/sending-email/quickstart-nodejs
      const sgMail = require('@sendgrid/mail')
      sgMail.setApiKey(process.env.SENDGRID_API_KEY)

      // including images in the SendGrid email is a bit tricky
      // https://sendgrid.com/blog/embedding-images-emails-facts/
      // for small images, inline them in the email
      const imageBase64 = fs.readFileSync(screenshotPath).toString('base64')

      const msg = {
        to: process.env.WORDLE_HINT_EMAIL,
        from: process.env.SENDGRID_FROM,
        subject: 'Wordle daily hint',
        text: `Today's hint: ${hint}`,
        html: `
          <div>Today's hint: <pre>${hint}</pre></div>
          <div><img src="data:image/png;base64,${imageBase64}" />pic</div>
          <div>Solved by cypress-wordle </div>
        `,
      }

      // because the full email might be hidden by the CI, let's only show the first 3 letters
      const maskedEmail = msg.to.slice(0, 3) + '...'
      console.log('sending an email to %s with a hint %s', maskedEmail, hint)
      const response = await sgMail.send(msg)
      if (response[0].statusCode !== 202) {
        console.error(response)
        throw new Error('SendGrid failed to send the email')
      }

      return response[0]
    },
  })

  require('cypress-data-session/src/plugin')(on, config)
  
}
