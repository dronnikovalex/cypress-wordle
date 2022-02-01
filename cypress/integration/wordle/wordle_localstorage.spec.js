import { enterWord } from '../utils/utils'

describe('It tests wordle game', () => {

  it('should solve worlde', () => {

    cy.visit('https://www.powerlanguage.co.uk/wordle/')
      .its('localStorage.gameState')
      .then(JSON.parse)
      .its('solution')
      .then(word => {
        cy.get('game-icon[icon="close"]:visible').click()
        const solution = word
        enterWord(solution)
      })
  })

})