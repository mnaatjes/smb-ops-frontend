Feature: Client Accounts Workspace, Care Plans, and Secret Vault
  As an SMB account manager
  I want to inspect client dossiers, attach care plans, log timecards, and securely manage credentials
  So that I maintain SLA continuity and track contract deliverables

  Background:
    Given the operator is viewing the "clients" workspace

  Scenario: Inspect full-canvas client workspace
    When the operator clicks on a client row
    Then the full-canvas Client Dossier workspace opens
    And displays Account Profile, SLA Health, Timecard Retainer, and Secret Vault

  Scenario: Attach an add-on Care Plan to client
    Given the Client Dossier workspace is open
    When the operator clicks "+ Attach Care Plan"
    And selects care plan tier "CARE_PLAN_30" with monthly rate "150"
    And clicks "Attach Contract"
    Then the new care plan appears under Active Service Contracts
    And the Maintenance Retainer gauge updates with a 30-minute monthly allowance

  Scenario: Expand contract accordion and verify deliverables checklist
    Given the Client Dossier workspace is open with active contracts
    When the operator clicks on the "CARE_PLAN_30" contract accordion header
    Then the discrete deliverables checklist expands
    And the operator can check off items and enter a Git Commit UUID

  Scenario: Add and reveal encrypted client secret in Vault
    Given the Client Dossier workspace is open
    When the operator clicks "+ Add Secret" in the Credentials & Vault panel
    And enters label "WP Admin", category "CMS", username "admin", password "SecretPass123"
    And clicks "Save Credential"
    Then the credential card appears with masked password
    When the operator clicks "Reveal" on the credential card
    Then the plaintext password is displayed with an active 15-second countdown timer
