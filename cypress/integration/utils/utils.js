export function enterWord(word) {
  word.split("").forEach(letter => {
    cy.window().trigger('keydown', { key: letter }).wait(100)
  })
  cy.window().trigger('keydown', { key: 'Enter' }).wait(2000)
}

export function tryNextWord(wordList) {
  let count = 0

  const word = Cypress._.sample(wordList)
  enterWord(word)
  
  cy.log('**word list with %d words**', wordList.length)

  if (wordList.length <= 20) {
    cy.log(wordList)
  }

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
        wordList = wordList.filter(w => w[k] === letter)
      }
    }).then(() => {
      if (count == word.length) {
        cy.log('**SOLVED**')
      } else {
        wordList.filter(w => w !== word)
        tryNextWord(wordList)
      }
    })
}
