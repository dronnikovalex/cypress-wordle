/// <reference types="cypress" />

describe('It tests wordle game', () => {

  it('this is %d item', { retries: 3 } , () => {

    cy.visit('cypress/integration/wordle/index.html')
    cy.get('a')
      .should(Cypress._.noop)

  })

})