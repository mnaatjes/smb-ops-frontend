Feature: Pursued Opportunity Dossier and Sales Pipeline
  As an SMB sales operator
  I want to inspect opportunity dossiers, log outreach activities, and track contacts
  So that I can convert qualified opportunities into signed contracts

  Background:
    Given the operator is viewing the "pipeline" workspace

  Scenario: Open opportunity full-canvas workspace drawer
    When the operator clicks on a pursued opportunity row
    Then the full-canvas Opportunity Dossier drawer opens
    And displays the contact roster, sales playbook, and OpenStreetMap context

  Scenario: Log an outreach activity with outcome
    Given the Opportunity Dossier is open for an opportunity
    When the operator enters activity note "Phone call with owner, requested audit demo"
    And selects activity type "CALL" and outcome "DEMO_SCHEDULED"
    And clicks "Log Activity"
    Then the new activity entry is added to the chronological interaction history

  Scenario: Add a key decision-maker contact to the opportunity
    Given the Opportunity Dossier is open
    When the operator clicks "+ Add Contact"
    And fills name "Sarah Connor", title "Owner / GM", email "sarah@acmehvac.com", phone "515-555-0199"
    And clicks "Save Contact"
    Then the new contact card appears in the Decision-Maker Roster
