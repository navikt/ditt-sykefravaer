const cypressTypeScriptPreprocessor = require('./cy-ts-preprocessor')

module.exports = (on) => {
    on('file:preprocessor', cypressTypeScriptPreprocessor)
    on('task', {
        log(message) {
            console.log(message)

            return null
        },
    })
}
