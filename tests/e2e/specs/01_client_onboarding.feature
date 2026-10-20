Feature: Client Onboarding and Contract Provisioning
  As an SMB operator
  I want to onboard new business clients and provision service contracts
  So that I can monitor continuity and track retainer deliverables

  Scenario: Successfully onboard a new client with an initial service contract
    Given the operator is on the Client Accounts workspace
    When the operator clicks "+ Onboard Client"
    And enters the client name "Acme HVAC Services"
    And enters the website url "https://acmehvac.com"
    And selects the primary service "WEB_HOSTING"
    And clicks "Submit"
    Then the client record "Acme HVAC Services" appears in the active client table
    And an initial service contract for "WEB_HOSTING" is attached
