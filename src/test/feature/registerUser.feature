Feature: Register User
@test
  Scenario: Register new User
    Given I navigated to the registeration page
    When I created a new user
    Then I confirm user registeration is success