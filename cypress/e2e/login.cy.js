describe('Login page testing', () => {
  beforeEach(() => {
    cy.visit('/login')
    cy.getDataTest('login-title').should('have.text', 'Todo App')
    cy.getDataTest('email-input').should('have.attr', 'placeholder', 'Email')
    cy.getDataTest('password-input').should('have.attr', 'placeholder', 'Password')
    cy.getDataTest('login-button').should('have.text', 'Login')
    cy.getDataTest('dont-have-account').should('have.text', 'Don’t have an account? Sign Up for Free')
  })

  it('Success login', () => {

    cy.fixture('user.json').its('empty').then((data) => {
      cy.getDataTest('email-input').type(data.email)
      cy.getDataTest('password-input').type(data.password)
      cy.getDataTest('login-button').click()
      cy.getDataTest('username').should('be.visible')
      cy.getDataTest('todo').should('have.text', 'Todo')
      cy.getDataTest('onprogress').should('have.text', 'On Progress')
      cy.getDataTest('done').should('have.text', 'Done')
    })

  })

  it('Login failed - Empty fields', () => {

    cy.fixture('user.json').its('empty').then((data) => {

      //all field empty
      cy.contains(/Please add all fields/i).should('not.exist')
      cy.getDataTest('login-button').click()
      cy.contains(/Please add all fields/i).should('be.visible')
      cy.reload()

      //empty email 
      cy.contains(/Please add all fields/i).should('not.exist')
      cy.getDataTest('email-input').type(data.email)
      cy.getDataTest('login-button').click()
      cy.contains(/Please add all fields/i).should('be.visible')
      cy.reload()

      //empty password
      cy.contains(/Please add all fields/i).should('not.exist')
      cy.getDataTest('password-input').type(data.password)
      cy.getDataTest('login-button').click()
      cy.contains(/Please add all fields/i).should('be.visible')

    })

  })

  it('Login failed - Invalid email', () => {

    cy.fixture('user.json').its('invalid_email').then((data) => {
      cy.contains(/Invalid emails./i).should('not.exist')
      cy.getDataTest('email-input').type(data.email)
      cy.getDataTest('password-input').type(data.password)
      cy.getDataTest('login-button').click()
      cy.contains(/Invalid emails./i).should('be.visible')
    })

  })

  it('Login failed - Email does not exists', () => {

    cy.fixture('user.json').its('doesnt_exists').then((data) => {

      cy.contains(/This user does not exist./i).should('not.exist')
      cy.getDataTest('email-input').type(data.email)
      cy.getDataTest('password-input').type(data.password)
      cy.getDataTest('login-button').click()
      cy.contains(/This user does not exist./i).should('be.visible')
    })

  })

  it('Login failed - Incorrect password', () => {

    cy.fixture('user.json').its('incorrect_pw').then((data) => {
      cy.contains(/Incorrect password./i).should('not.exist')
      cy.getDataTest('email-input').type(data.email)
      cy.getDataTest('password-input').type(data.password)
      cy.getDataTest('login-button').click()
      cy.contains(/Incorrect password./i).should('be.visible')
    })

  })

  it('Go to sign up page', () => {
    cy.getDataTest('dont-have-account').within(() => {
      cy.get('a').should('have.text', 'Sign Up for Free')
      cy.get('a').click()
    })
    cy.location("pathname").should("equal", "/register")
  })
})