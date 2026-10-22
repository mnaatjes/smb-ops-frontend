Feature: Client Workspace, Contracts, and Vault Security
  As an SMB operator
  I want to inspect client dossiers, attach new service contracts, and register infrastructure secrets
  So that I can govern client engagements and maintain credential hygiene

  Background:
    Given the operator is viewing the "clients" workspace
    And an existing client "Summit Logistics" is selected in the triage table

  Scenario: Inspect dossier drawer and attach a new contract agreement
    When the operator opens the client dossier for "Summit Logistics"
    Then the client dossier drawer slides open displaying client details
    When the operator clicks "Attach Contract" in the contracts section
    Then the "Attach Service Contract" modal opens
    When the operator selects service "Care Plan Retainer"
    And toggles billing cycle to "Monthly Retainer"
    And sets the agreed monthly rate to "650.00"
    And clicks "Attach Contract Agreement"
    Then the contract agreement modal closes
    And "Care Plan Retainer" appears in the client contracts list with status "Active"

  Scenario: Add an encrypted infrastructure secret to client vault
    When the operator opens the client dossier for "Summit Logistics"
    And navigates to the "Infrastructure Secrets" tab
    And clicks "+ Add Secret"
    Then the "Add Infrastructure Secret" modal opens
    When the operator enters label "Database Read Replica"
    And selects secret type "DATABASE_CREDENTIALS"
    And enters username "summit_read"
    And enters password "VaultSecretPass456#"
    And clicks "Save Secret"
    Then the secret modal closes
    And "Database Read Replica" appears in the secret list with masked password
    And the reveal timer displays upon clicking "Reveal"
