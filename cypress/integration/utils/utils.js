
export function enterWord(word) {
  word.split('').forEach(letter => {
    cy.window().trigger('keydown', { key: letter }).wait(100)
  })
  cy.window().trigger('keydown', { key: 'Enter' }).wait(2000)
}

export function countUniqueLetters(word) {
  return new Set(word).size
}

export function tryNextWord(wordList) {

  if (wordList.length <= 20) {
    cy.log(wordList)
  }

  cy.log(`**word list with ${wordList.length} words**`)
  expect(wordList).to.not.be.empty

  const word = Cypress._.sample(wordList)
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

        // cy.get('game-icon[icon="close"]:visible')
        //   .click()
        //   .wait(1000)

        // cy.get('game-tile[letter]')
        //   .find('.tile')
        //   .invoke('text', '')

        // const index = Cypress._.random(0, 4)
        // const letter = word[index]
        // const hint = '01234'.replace(index, letter).replace(/\d/g, '*')
        // cy.log(`**${hint}**`)

        // cy.get(`game-row[letters=${word}]`)
        //   .find(`game-tile[letter=${letter}]`)
        //   .find('.tile')
        //   .invoke('text', letter)

        // cy.get('#board-container')
        //   .screenshot('hint', { overwrite: true })
        
        // optional task to send wordle hint to email
        // cy.task('sendHintEmail', {
        //   hint,
        //   screenshot: `${Cypress.spec.name}/hint.png`
        // })

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
