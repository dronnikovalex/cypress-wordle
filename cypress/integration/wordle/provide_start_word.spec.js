import { enterWord, countUniqueLetters } from '../utils/utils'

function tryNextWord(wordList, word) {

  if (wordList.length <= 20) {
    cy.log(wordList)
  }

  cy.log(`**word list with ${wordList.length} words**`)
  expect(wordList).to.not.be.empty

  if (!word) {
    word = Cypress._.sample(wordList)
  }

  expect(word, 'picked word').to.be.a('string')
  cy.log(`**PLAYING WITH WORD - ${word}**`)
  enterWord(word)

  let count = 0
  let seen = new Set()

  cy.get(`game-row[letters=${word}]`)
    .find('game-tile').each(($tile, k) => {
      const letter = $tile.attr('letter')

      if (seen.has(letter)) {
        return
      }
      seen.add(letter)

      const evaluation = $tile.attr('evaluation')

      if (evaluation === 'absent') {
        wordList = wordList.filter(w => !w.includes(letter))
      }

      else if (evaluation === 'present') {
        wordList = wordList.filter(w => w.includes(letter))
      }

      else if (evaluation === 'correct') {
        count++
        cy.log(count)
        wordList = wordList.filter(w => w[k] === letter)
      }
    }).then(() => {
      if (count == countUniqueLetters(word)) {
        cy.log('**SOLVED**')
          .wait(1000)
        cy.screenshot('start-word', { overwrite: true })
      } else {
        cy.get('game-row[letters]').eq(5).invoke('attr', 'letters')
          .then(lastRowText => {
            if (lastRowText && count !== countUniqueLetters(word)) {
              cy.log(`**CAN'T SOLVE THE GAME**`)
            } else {
              cy.log(`**CURRENT LENGTH OF WORDLIST = ${wordList.length}**`)
              tryNextWord(wordList)
            }
          })
      }
    })
}

describe('It tests wordle game', () => {

  it('should provide first word', { retries: 3 }, () => {

    cy.intercept('GET', '**/main.*.js', req => {
      req.continue(res => {
        res.body = res.body.replace('=["cigar"', '=window.wordList=["cigar"') //Intercept js file and add additional property "wordList" which contains all of the 5 letter words to a window obj 
      })
    }).as('words')
    // Now its possible to expose wordList property by using window object
    cy.visit('https://www.powerlanguage.co.uk/wordle/')
      .its('wordList')
      .then(wordList => {

        cy.get('game-icon[icon="close"]:visible')
          .click()
          .wait(1000)
        
        const word = Cypress.env('startWord') || 'start' // set value by providing it from environment 
        tryNextWord(wordList, word)

      })
  })

})
