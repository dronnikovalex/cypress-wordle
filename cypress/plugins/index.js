/// <reference types="cypress" />

const path = require('path')
const fs = require('fs')

module.exports = (on, config) => {
  
  on('task', {
    SendHintToEmail({ hint, screenshot }) {
      const screenshotPath = path.join(config.screenshotsFolder, screenshot)
      console.log(screenshotPath)

      return null
    },
    test() {
      if (!process.env.TEST_VARIABLE) {
        console.log('NO VARAIBLE IN ENV')
        
      } else {
        console.log('VARAIBLE IS PRESENT')
      }

      return null
    }
  })
}
