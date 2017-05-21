let nodemailer = require('nodemailer')
let sgTransport = require('nodemailer-sendgrid-transport')
let pdf = require('html-pdf')
let qr = require('qr-image')
require('dotenv').config()
let dateFormat = require('dateFormat')

let options = {
  auth: {
    api_key: process.env.SEND_GRID_KEY
  }
}

let mailer = nodemailer.createTransport(sgTransport(options))
let optionsPDF = {
  'format': 'A4',
  'orientation': 'portrait'
}
module.exports = {
  sendTicket: (cryptedString, user, event) => {
    //  console.log('EVENT ' + JSON.stringify(event))
    let qrSvg = qr.imageSync(cryptedString, { type: 'svg' })
    let date = dateFormat(event.time, 'HH:MM') + ' ' + dateFormat(event.date, 'dddd, mmmm dS, yyyy')
    let artistName = event.title
    let clubName = event.place
    let guestEmail = user.email
    let name = user.firstName + ' ' + user.lastName
    // let address = 'Sofia, bul. Maria Luiza 126'
    let emailContent = '<b>Здравей </b>' + name + '<br><p> Благодарим ти за интереса към нашето събитие.' +
                          'Като прикачен файл ще откриеш билет като комплимент от нас.<br> Надяваме се да ти хареса!</p>' +
                          '<p>Научи повече за нас и как осъществяваме събитията си <a href="http://dgty-promo.com/faq/"> тук </a>.</p>' +
                          '<p>Екипа на Tranc3motion.</p>'
    let htmlTicket = '<html><head><meta charset="utf8"></head><body style="">' +
                        '<div style="overflow: hidden; font-family: Arial, Helvetica, sans-serif; border-bottom-style: dashed;">' +
                        '<div style="float:left; width:65%; padding: 0 0 0 20px;">' +
                        '<h3>' + artistName + '</h3>' +
                        '<p>Name: ' + name + '<br> <br> Date: ' + date + '</p>' +
                        '<p><b>Place: ' + clubName + '</b>' + '</p>' +
                        '</div><div style="max-width: 30%; height:180px; width:100%; float:right;">' + qrSvg + '</div></div>' +
                        '</body></html>'

    pdf.create(htmlTicket, optionsPDF).toBuffer(function (err, buffer) {
      if (err) console.log(err)
      let email = {
        to: [guestEmail],
        from: 'testAccount@gmail.com',
        subject: 'Test ticket',
        text: 'Test ticket',
        html: emailContent,
        attachments: [{
          filename: 'Ticket.pdf',
          content: buffer,
          contentType: 'application/pdf'
        }]
      }
      // console.log('TICKET' + JSON.stringify(email))
      mailer.sendMail(email, function (err, res) {
        if (err) {
          console.log('ERR MAIL' + JSON.stringify(err))
        }
        console.log('RES' + JSON.stringify(res))
      })
    })
  }
}
