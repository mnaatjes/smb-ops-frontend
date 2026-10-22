Feature: Timecard Work Logging and Maintenance Telemetry
  As an SMB operator
  I want to log maintenance hours against care plan retainers and view capacity gauges
  So that I can prevent scope creep and ensure timely client retainer delivery

  Background:
    Given the operator is viewing the client dossier for "Summit Logistics"
    And "Summit Logistics" has an active care plan with 10 retainer hours allocated

  Scenario: Successfully log retainer maintenance work
    When the operator clicks "Log Maintenance Work"
    Then the "Log Maintenance Work" modal opens
    When the operator enters minutes worked "120"
    And selects work category "Care Plan Retainer"
    And enters work summary "Security kernel patches and SSL rotation"
    And clicks "Save Timecard Entry"
    Then the modal closes
    And the new timecard entry displays in the activity history
    And the maintenance gauge updates to reflect 2 hours used out of 10 hours

  Scenario: Prevent logging retainer work when client has no care plan
    Given the operator is viewing a client without an active care plan
    When the operator clicks "Log Maintenance Work"
    Then the "Log Maintenance Work" modal displays an alert indicating no active care plan
    And the retainer option is disabled in the category selector
