/// <reference types="cypress-data-session" />
import { tryNextWord } from '../utils/utils'

describe('It tests wordle game', () => {
  beforeEach(() => {
    cy.dataSession({
      name: 'wordList',
      setup: () => {
        cy.intercept('GET', '**/main.*.js', req => {
          req.continue(res => {
            res.body = res.body.replace('=["cigar"', '=window.wordList=["cigar"') //Intercept js file and add additional property "wordList" which contains all of the 5 letter words to a window obj 
          })
        })
        cy.visit('https://www.powerlanguage.co.uk/wordle/').its('wordList')
      },
      validate: true,
      shareAcrossSpecs: true //will keep data in plugin even after hard reaload/reboot browser
    })
  })

  Cypress._.range(1, 5).forEach(day => {
    const date = `2022-01-${day}`

    it(`should solve it for real from ${date}`, { retries: 2 }, () => {

      //Start play wordle from a specific date by cy.clock
      cy.clock(Date.UTC(2022, 0, day), ['Date'])
      // Now its possible to expose wordList property by using window object
      cy.visit('https://www.powerlanguage.co.uk/wordle/')
      cy.get('game-icon[icon="close"]:visible')
        .click()
        .wait(1000)

      cy.then(function () {
        tryNextWord(this.wordList)
      })
    })

  })

})