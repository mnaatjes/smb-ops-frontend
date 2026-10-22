Feature: Client Onboarding and Multi-Step Provisioning
  As an SMB operator
  I want to onboard a new business client through a guided multi-step wizard
  So that I can capture company contact details, select required service offerings, and record initial credentials

  Background:
    Given the operator is authenticated and on the "clients" workspace

  Scenario: Successfully complete the client onboarding wizard
    When the operator clicks "+ Onboard Client"
    Then the "Client Onboarding Wizard" modal is displayed at step "Contact & Identity"
    When the operator enters company name "Apex Precision Tooling"
    And enters primary contact "Sarah Connor"
    And enters email "s.connor@apexpt.com"
    And enters phone "555-0199"
    And enters website "https://apexpt.com"
    And clicks "Next: Select Services"
    Then the wizard advances to step "Service Offerings"
    When the operator selects service "Managed Hosting & Infrastructure"
    And enters an agreed rate of "250.00"
    And clicks "Next: Vault & Dispatch"
    Then the wizard advances to step "Vault & Dispatch"
    When the operator enters secret label "Production Server SSH"
    And selects secret type "SERVER_SSH"
    And enters secret username "root"
    And enters secret password "TemporaryApexKey2026!"
    And clicks "Complete Onboarding"
    Then the modal closes
    And "Apex Precision Tooling" appears in the active client accounts list
    And the account shows an active "Managed Hosting & Infrastructure" contract

  Scenario: Dismiss onboarding wizard without saving
    When the operator clicks "+ Onboard Client"
    Then the "Client Onboarding Wizard" modal is displayed
    When the operator clicks "Cancel"
    Then the "Client Onboarding Wizard" modal is dismissed
    And no new client record is created
