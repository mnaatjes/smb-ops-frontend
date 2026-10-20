Feature: Lead Discovery and Triage Lifecycle
  As an SMB operator
  I want to discover leads, filter by target service, and triage prospects
  So that I can qualify high-value opportunities into the sales pipeline

  Background:
    Given the operator is logged into SMB Operations
    And the application is viewing the "pool" workspace

  Scenario: Run unified discover and audit on a target market
    When the operator enters location "Kalamazoo, MI" and limit "10"
    And clicks "Discover & Audit Leads"
    Then the discovery bar displays an active scan spinner
    And upon completion new prospects appear in the triage table

  Scenario: Filter triage table by target service code
    When the operator selects service "WEB_HOSTING" in the service filter dropdown
    Then only leads with opportunity code "WEB_HOSTING" are displayed in the table

  Scenario: Qualify a high-scoring prospect into pursued opportunity
    When the operator clicks "Qualify" on a lead row
    Then the lead disposition changes to "pursued"
    And the lead moves from the "pool" table to the "pipeline" table

  Scenario: Disqualify a lead with a documented reason
    When the operator clicks "Disqualify" on a lead row
    And the disqualification modal opens
    And the operator selects reason "OUT_OF_MARKET" with notes "Outside service radius"
    And clicks "Confirm Disqualification"
    Then the lead is removed from active pool triage
