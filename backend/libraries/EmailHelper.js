const sgMail = require('@sendgrid/mail') // first run 'npm install @sendgrid/mail'
const fs = require('fs'); // first run 'npm install fs'

class EmailHelper {

    static htmlTemplate = ''

    static sendEmail(recipient, subject, textContent = null, htmlContent = null, template = null) {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY)
        if (!textContent) textContent = subject;

        const msg = {
            to: recipient, 
            from: process.env.SENDGRID_FROM || 'jo.batkin@institutedata.com', // Change to your verified sender
            subject: subject,
        }

        if (htmlContent) {
            msg.content = [ 
                { "type": "text/plain", value: textContent },
                { "type": "text/html", value: htmlContent } 
            ]
        }
        else if (template) { 
            msg.template_id = template;
        }

        // returns a promise resolving to a response from using the SendGrid API to send the email
        return sgMail.send(msg)
    }

    // Takes the given content and inserts it into a HTML email template, then sends the email to the recipient
    static async sendHTMLEmail(recipient, subject, content) {
        const data = await fs.promises.readFile(__dirname + '/../templates/email.html', 'utf8');
        return EmailHelper.sendEmail(recipient, subject, content, data.replace('[CONTENT]', content))
    }

    // Uses a SendGrid template ID to send a pre-configured password reset email
    static sendPasswordReset(recipient) {
        // uses a pre-created dynamic template in SendGrid account with the given id
        return EmailHelper.sendEmail(recipient, 'Your password has been reset', null, null, 'd-c3c8301936114c3fb825ad3dc290472b')
    }
}

module.exports = EmailHelper