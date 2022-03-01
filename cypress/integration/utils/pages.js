import { enterWord, countUniqueLetters } from '../utils/utils'

import { tryNextWord } from '../wordle/provide_start_word.spec'
const silent = { log: false }

export const Start = {
  close() {
    cy.get('game-icon[icon="close"]:visible')
      .click()
      .wait(1000, silent)
  }
}

export const Solved = {
  close() {
    cy.log('**hiding the solved game modal**')
    cy.get('#share-button')
      .should('be.visible')
      .wait(1000, silent)
    return cy.get('game-icon[icon="close"]:visible')
      .click()
      .wait(1000, silent)
  }
}

export const Playing = {
  enterWord,

  getLetters(word) {
    return cy
      .get(`game-row[letters=${word}]`)
      .find('game-tile', silent)
      .should('have.length', word.length)
      .then(($tiles) => {
        return $tiles.toArray().map((tile, k) => {
          const letter = tile.getAttribute('letter')
          const evaluation = tile.getAttribute('evaluation')
          console.log('%d: letter %s is %s', k, letter, evaluation)
          return { k, letter, evaluation }
        })
      })
  },

  isWinnable(wordList, word) {
    cy.get('game-row[letters]').eq(5).invoke('attr', 'letters')
    .then(lastRowText => {
      if (lastRowText && count !== countUniqueLetters(word)) {
        cy.log(`**CAN'T SOLVE THE GAME**`)
      } else {
        tryNextWord(wordList)
      }
    })
  }
}