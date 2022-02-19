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