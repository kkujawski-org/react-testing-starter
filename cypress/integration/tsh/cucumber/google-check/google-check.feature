Feature: Google Main Page

  I want to open a search engine

  @focus
  Scenario: Opening a search engine page
    Given I open Google page
    When I accept the cookies
    Then I see "Google" in the title