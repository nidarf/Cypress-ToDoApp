describe('Success access todo page and logout from the page', () => {
    beforeEach(() => {
        cy.login('nida@gmail.com', '123456')
        cy.visit('/')
    })

    it('Access todo page', () => {
        cy.getDataTest('username').should('be.visible')
        cy.getDataTest('todo').should('have.text', 'Todo')
        cy.getDataTest('onprogress').should('have.text', 'On Progress')
        cy.getDataTest('done').should('have.text', 'Done')
    })

    it('Logout', () => {
        cy.getDataTest('dropdown').click()
        cy.getDataTest('logout').click()
        cy.getDataTest('email-input').should('have.attr', 'placeholder', 'Email')
        cy.getDataTest('password-input').should('have.attr', 'placeholder', 'Password')
        cy.getDataTest('login-button').should('have.text', 'Login')
    })
})

describe('Update and Delete task', () => {
    beforeEach(() => {
        cy.login('nida@gmail.com', '123456')
        cy.visit('/')
        //clear db
    })

    it('Delete task', () => {
        //create new data
        cy.create_task("Task 1: Membuat test case document!", "on progress")

        //delete
        cy.getDataTest('delete_button').click()
        cy.getDataTest('delete_button').should('not.exist')
    })

    it('Update task', () => {
        //create new data
        cy.create_task("Task 1: Membuat test case document!", "on progress")

        //update
        cy.wait(3000)
        cy.getDataTest('edit_status').select(2)
        cy.wait(3000)
        cy.getDataTest('edit_status').select(0)
        cy.wait(3000)
        cy.getDataTest('edit_status').select(1)
    })
})

describe('Add new task functionality', () => {
    beforeEach(() => {
        cy.login('nida@gmail.com', '123456')
        cy.visit('/')
        cy.getDataTest('newtask').click()
        cy.getDataTest('addtask').within(() => {
            cy.get('h1').should('have.text', 'Add New Task')
            cy.contains(/status/i).should('exist')
            cy.get('textarea').should('exist')
            cy.get('textarea').should('have.attr', 'placeholder', 'type your task here')
            cy.get('select').select(0).should('have.value', '')
            cy.getDataTest('close_button').should('have.text', 'Close')
            cy.getDataTest('save_button').should('have.text', 'Save')
        })
        cy.fixture('task.json').as('data')
    })

    it('Successfully add new task for all status', () => {
        cy.get('@data').its('task_status').then((data) => {
            //all status with normal description(letter, number, symbol)
            data.forEach((status) => {
                cy.get('textarea').type(status.desc)
                cy.getDataTest('new_task_status').select(status.option).should('have.value', status.value)
                cy.getDataTest('save_button').click()
                cy.getDataTest('addtask').should('not.exist')
                cy.getDataTest('newtask').click()
            })

            //new task with long description(letter, number, symbol)

            data.forEach((status) => {
                cy.get('textarea').type(status.long_desc)
                cy.getDataTest('new_task_status').select(status.option).should('have.value', status.value)
                cy.getDataTest('save_button').click()
                cy.getDataTest('addtask').should('not.exist')
                cy.getDataTest('newtask').click()
            })

            cy.getDataTest('close_button').click()
            cy.getDataTest('addtask').should('not.exist')

        })

    })

    it('Failed add new task - Blank field', () => {
        cy.contains(/Please fill all fields/i).should('not.exist')
        cy.getDataTest('save_button').click()
        cy.contains(/Please fill all fields/i).should('be.visible')
    })

    it('Failed add new task - Empty status field ', () => {
        cy.contains(/Please fill all fields/i).should('not.exist')
        cy.get('@data').its('task_desc').then((data) => {
            cy.get('textarea').type(data.desc)
        })
        cy.getDataTest('save_button').click()
        cy.contains(/Please fill all fields/i).should('be.visible')
    })

    it('Failed add new task - Empty task decription field ', () => {
        cy.get('@data').its('task_status').then((data) => {
            data.forEach((status) => {
                cy.contains(/Please fill all fields/i).should('not.exist')
                cy.getDataTest('new_task_status').select(status.option).should('have.value', status.value)
                cy.getDataTest('save_button').click()
                cy.contains(/Please fill all fields/i).should('be.visible')
                //choose default value
                cy.getDataTest('new_task_status').select([])
            })
        })
    })

    it('Canceled add new task', () => {
        cy.getDataTest('close_button').click()
        cy.getDataTest('addtask').should('not.exist')
    })

})