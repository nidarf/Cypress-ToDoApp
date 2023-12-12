describe('Register page testing', () => {
  beforeEach(() => {
    cy.visit('/register')
    cy.getDataTest('register-title').should('have.text', 'Todo App')
    cy.getDataTest('username-input').should('have.attr', 'placeholder', 'Username')
    cy.getDataTest('email-input').should('have.attr', 'placeholder', 'Email')
    cy.getDataTest('password-input').should('have.attr', 'placeholder', 'Password')
    cy.getDataTest('register-button').should('have.text', 'Sign Up')
    cy.getDataTest('already-have-account').should('have.text', 'Already have an account? Login')
  })

  it('Success create an account', () => {

    cy.fixture('user.json').its('new').then((data) => {
      cy.getDataTest('username-input').type(data.username)
      cy.getDataTest('email-input').type(data.email)
      cy.getDataTest('password-input').type(data.password)
      cy.getDataTest('register-button').click()
      cy.location("pathname").should("equal", "/login")
    })

  })

  it('Registration failed - Empty fields', () => {

    cy.fixture('user.json').its('empty').then((data) => {

      //all field empty
      cy.contains(/Please add all fields/i).should('not.exist')
      cy.getDataTest('register-button').click()
      cy.contains(/Please add all fields/i).should('be.visible')
      cy.reload()

      //empty username 
      cy.contains(/Please add all fields/i).should('not.exist')
      cy.getDataTest('email-input').type(data.email)
      cy.getDataTest('password-input').type(data.password)
      cy.getDataTest('register-button').click()
      cy.contains(/Please add all fields/i).should('be.visible')
      cy.reload()

      //empty email
      cy.contains(/Please add all fields/i).should('not.exist')
      cy.getDataTest('username-input').type(data.username)
      cy.getDataTest('password-input').type(data.password)
      cy.getDataTest('register-button').click()
      cy.contains(/Please add all fields/i).should('be.visible')
      cy.reload()

      //empty password
      cy.contains(/Please add all fields/i).should('not.exist')
      cy.getDataTest('username-input').type(data.username)
      cy.getDataTest('email-input').type(data.email)
      cy.getDataTest('register-button').click()
      cy.contains(/Please add all fields/i).should('be.visible')

    })

  })

  it('Registration failed - Invalid email', () => {

    cy.fixture('user.json').its('invalid_email').then((data) => {
      cy.contains(/Invalid emails./i).should('not.exist')
      cy.getDataTest('username-input').type(data.username)
      cy.getDataTest('email-input').type(data.email)
      cy.getDataTest('password-input').type(data.password)
      cy.getDataTest('register-button').click()
      cy.contains(/Invalid emails./i).should('be.visible')
    })

  })

  it('Registration failed - Email or username already exists', () => {

    cy.fixture('user.json').its('already_exists').then((data) => {
      data.forEach((userdata) => {
        cy.contains(/This email or username already exists./i).should('not.exist')
        cy.getDataTest('username-input').type(userdata.username)
        cy.getDataTest('email-input').type(userdata.email)
        cy.getDataTest('password-input').type(userdata.password)
        cy.getDataTest('register-button').click()
        cy.contains(/This email or username already exists./i).should('be.visible')
        cy.reload()
      })
    })

  })

  it('Password validation', () => {
    let userdata;
    cy.fixture('user.json').its('test_pwd').then((data) => {
      data.forEach((userdata) => {
        cy.contains(/Password must be at least 6 characters./i).should('not.exist')
        cy.getDataTest('username-input').type(userdata.username)
        cy.getDataTest('email-input').type(userdata.email)
        cy.getDataTest('password-input').type(userdata.password)
        cy.getDataTest('register-button').click()

        if (userdata.password.length < 6) {
          cy.contains(/Password must be at least 6 characters./i).should('be.visible')
          cy.reload()
        } else {
          cy.location("pathname").should("equal", "/login")
          cy.visit('/register')
        }

      })

    })

  })

  it('Go to login page', () => {
    cy.getDataTest('already-have-account').within(() => {
      cy.get('a').should('have.text', 'Login')
      cy.get('a').click()
    })
    cy.location("pathname").should("equal", "/login")
  })
})