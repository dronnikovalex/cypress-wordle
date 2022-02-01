import { tryNextWord } from '../utils/utils'

describe('It tests wordle game', () => {

  it('should solve it for real', { retries: 2 }, () => {

    cy.intercept('GET', '**/main.*.js', req => {
      req.continue(res => {
        res.body = res.body.replace('=["cigar"', '=window.wordList=["cigar"') //Intercept js file and add additional property "wordList" which contains all of the 5 letter words to a window obj 
      })
    }).as('words')

    //Start play wordle from a specific date by cy.clock
    cy.clock(Date.UTC(2022, 1, 30), ['Date'])
    // Now its possible to expose wordList property by using window object
    cy.visit('https://www.powerlanguage.co.uk/wordle/')
      .its('wordList')
      .then(wordList => {

        cy.get('game-icon[icon="close"]:visible')
          .click()
          .wait(1000)

        tryNextWord(wordList)

      })
  })

})