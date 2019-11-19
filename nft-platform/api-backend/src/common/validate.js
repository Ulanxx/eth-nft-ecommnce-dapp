const validator = require('validator')

function validate(object, rules) {
  let result = true

  try {
    rules.forEach(rule => {
      switch(rule.check_type) {
        case 'base64':
          if (!validator.isBase64(object[rule.name])) {
            return false
          }
          break
        case 'string':
          if (!((typeof object[rule.name]) === 'string')) {
            return false
          }
          break
        case 'existence':
          if (object[rule.name] === undefined) {
            return false
          }
          break
        case 'range':
          if (object[rule.name] < rule.min || object[rule.name] > rule.max) {
            return false
          }
          break
        default:
          break
      }
    })
  } catch (err) {
    logger.error(`error while validating ${object}: ${err}`)
    result = false
  }

  return result
}

export default validate
