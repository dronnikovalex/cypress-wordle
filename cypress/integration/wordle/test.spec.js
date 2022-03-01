/// <reference types="cypress" />

describe('It tests wordle game', () => {

  it('this is %d item', { retries: 3 } , () => {

    const person = {
      name: 'Alex',
      getName() {
        return this.name
      }
    }

    const person2 = {
      name: 'Kek'
    }
    console.log(person.getName.call(person2))
  })

})