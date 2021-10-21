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

///<reference path="../global.d.ts" />

import { pick } from 'lodash/fp';
import { format as formatDate } from 'date-fns';
import '@testing-library/cypress/add-commands';

Cypress.Commands.add('getByDataTest', (selector, ...args) => {
  return cy.get(`[data-test=${selector}]`, ...args);
});

Cypress.Commands.add('getByDataTestLike', (selector, ...args) => {
  return cy.get(`[data-test*=${selector}]`, ...args);
});

Cypress.Commands.add('loginByApi', (username, password = Cypress.env('defaultPassword')) => {
  return cy.request('POST', `${Cypress.env('apiUrl')}/login`, {
    username,
    password,
  });
});

Cypress.Commands.add('loginViaApi', (username, password = Cypress.env('defaultPassword')) => {
  cy.visit('/signin', { log: true });
  cy.window().then((win) => win.authService.send('LOGIN', { username, password }));
});

Cypress.Commands.add('loginByXstate', (username, password = Cypress.env('defaultPassword')) => {
  const log = Cypress.log({
    name: 'loginbyxstate',
    displayName: 'LOGIN BY XSTATE',
    message: [`🔐 Authenticating | ${username}`],
    autoEnd: false,
  });

  cy.intercept('POST', '/login').as('loginUser');
  cy.intercept('GET', '/checkAuth').as('getUserProfile');
  cy.visit('/signin', { log: false }).then(() => {
    log.snapshot('before');
  });

  cy.window({ log: false }).then((win) => win.authService.send('LOGIN', { username, password }));

  cy.wait('@loginUser').then((loginUser) => {
    log.set({
      consoleProps() {
        return {
          username,
          password,
          // @ts-ignore
          userId: loginUser.response.body.user.id,
        };
      },
    });
  });

  return cy
    .getByDataTest('list-skeleton')
    .should('not.exist')
    .then(() => {
      log.snapshot('after');
      log.end();
    });
});

Cypress.Commands.add('database', (operation, entity, query, logTask = false) => {
  const params = {
    entity,
    query,
  };

  const log = Cypress.log({
    name: 'database',
    displayName: 'DATABASE',
    message: [`🔎 ${operation}ing within ${entity} data`],
    // @ts-ignore
    autoEnd: false,
    consoleProps() {
      return params;
    },
  });

  return cy.task(`${operation}:database`, params, { log: logTask }).then((data) => {
    log.snapshot();
    log.end();
    return data;
  });
});
