/// <reference types="cypress" />

declare namespace Cypress {
  import { authService } from '..src/machines/authMachine';
  import { createTransactionService } from '../src/machines/createTransactionMachine';
  import { publicTransactionService } from '../src/machines/publicTransactionsMachine';
  import { contactsTransactionService } from '../src/machines/contactsTransactionsMachine';
  import { personalTransactionService } from '../src/machines/personalTransactionsMachine';
  import {
    User,
    BankAccount,
    Like,
    Comment,
    Transaction,
    BankTransfer,
    Contact,
  } from '../src/models';

  interface CustomWindow extends Window {
    authService: typeof authService;
    createTransactionService: typeof createTransactionService;
    publicTransactionService: typeof publicTransactionService;
    contactTransactionService: typeof contactsTransactionService;
    personalTransactionService: typeof personalTransactionService;
  }

  type dbQueryArg = {
    entity: string;
    query: object | [object];
  };

  type LoginOptions = {
    rememberUser: boolean;
  };

  interface Chainable {
    /**
     *  Window object with additional properties used during test.
     */
    window(options?: Partial<Loggable & Timeoutable>): Chainable<CustomWindow>;

    getByDataTest(dataTestAttribute: string, args?: any): Chainable<Element>;
    getByDataTestLike(dataTestPrefixAttribute: string, args?: any): Chainable<Element>;

    /**
     *  Cypress task for directly querying to the database within tests
     */
    task(
      event: 'filter:database',
      arg: dbQueryArg,
      options?: Partial<Loggable & Timeoutable>
    ): Chainable<any[]>;

    /**
     *  Cypress task for directly querying to the database within tests
     */
    task(
      event: 'find:database',
      arg?: any,
      options?: Partial<Loggable & Timeoutable>
    ): Chainable<any>;

    /**
     * Find a single entity via database query
     */
    database(operation: 'find', entity: string, query?: object, log?: boolean): Chainable<any>;

    /**
     * Filter for data entities via database query
     */
    database(operation: 'filter', entity: string, query?: object, log?: boolean): Chainable<any[]>;

    /**
     * Fetch React component instance associated with received element subject
     */
    reactComponent(): Chainable<any>;

    /**
     * Select data range within date range picker component
     */
    pickDateRange(startDate: Date, endDate: Date): Chainable<void>;

    /**
     * Logs-in user by using UI
     */
    login(username: string, password: string, loginOptions?: LoginOptions): void;

    /**
     * Logs-in user by using API request
     */
    loginByApi(username: string, password?: string): Chainable<Response>;

    /**
     * Logs-in user to the UI via API request
     */
    loginViaApi(username: string, password?: string): Chainable<Response>;

    /**
     * Logs in bypassing UI by triggering XState login event
     */
    loginByXstate(username: string, password?: string): Chainable<any>;

    /**
     * Logs out via bypassing UI by triggering XState logout event
     */
    logoutByXstate(): Chainable<void>;

    /**
     * Switch current user by logging out current user and logging as user with specified username
     */
    switchUserByXstate(username: string): Chainable<any>;

    /**
     * Create Transaction via bypassing UI and using XState createTransactionService
     */
    createTransaction(payload): Chainable<any>;
  }
}
