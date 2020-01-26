const mailgun = require('mailgun.js')
const ALIASES = [{ reply: 'h:Reply-To' }]

/** Possible options
 * to: 'Vidar Eldøy <vidar@eldoy.com>',
 * from: 'Vidar Eldøy <vidar@eldoy.com>',
 * cc: 'cc@eldoy.com',
 * bcc: 'bcc@eldoy.com',
 * subject: 'hello',
 * html: '<h1>Helloæøå</h1>',
 * text: 'Helloæøå',
 * reply: 'vidar@eldoy.com',
 * attachment: [file]
*/

function replaceKeys(options) {
  for (const pair of ALIASES) {
    for (const key in pair) {
      const val = pair[key]
      if (options[key]) {
        options[val] = options[key]
        delete options[key]
      }
    }
  }
}

module.exports = function(config = {}) {
  return async function(name, options, $, data) {
    replaceKeys(options)
    const mail = await config.app.mail[name]($, data)
    const html = await config.app.layouts[mail.html.layout](mail, $, data)
    const text = await config.app.layouts[mail.text.layout](mail, $, data)
    options = { ...config.options, ...mail.options, html, text, ...options }
    const mg = mailgun.client({ username: 'api', key: config.key })
    return mg.messages.create(config.domain, options)
  }
}
