module.exports = async function($, data) {
  return {
    subject: 'mail3',
    html: {
      content: `
        mail3 mustache content link {{key}}
      `
    },
    text: {
      content: `mail3 text content link {{key}}`
    }
  }
}
