// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('getDataTest', (dataTestSelector) => {
    return cy.get(`[data-test="${dataTestSelector}"]`)
})

Cypress.Commands.add('login', (email, password) => {
    cy.session([email, password], () => {
        cy.visit('/')
        cy.getDataTest('email-input').type(email)
        cy.getDataTest('password-input').type(password)
        cy.getDataTest('login-button').click()
        cy.getDataTest('username').should('be.visible')
    },
        {
            cacheAcrossSpecs: true
        }
    )
})

Cypress.Commands.add('create_task', (desc, status) => {
    cy.getDataTest('newtask').click()
    cy.get('textarea').type(desc)
    cy.getDataTest('new_task_status').select(status)
    cy.getDataTest('save_button').click()
    cy.getDataTest('addtask').should('not.exist')
})