describe('It tests wordle game', () => {

  it('should solve it for real', { retries: 3 } , () => {

    cy.task('test')

    console.log(Cypress.env(TEST_VARIABLE))
  })

})