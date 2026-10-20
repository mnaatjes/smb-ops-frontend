Feature: Service Catalog Management and Business Doctrine
  As an SMB administrator
  I want to define service catalog offerings and consult business doctrine
  So that sales and onboarding operate under consistent tiers and standards

  Scenario: Create a new service catalog offering
    Given the operator is viewing the "services" workspace
    When the operator clicks "+ Create Service"
    And fills code "SEO_AUDIT", name "Local SEO Audit", tier "TIER_1_STANDARD", rate "250", frequency "ONE_TIME"
    And clicks "Save Service"
    Then the new service "Local SEO Audit" is visible in the Service Catalog

  Scenario: View interactive Business Doctrine documents
    Given the operator is viewing the "doctrine" workspace
    When the operator selects doctrine document "Standard Operating Procedures"
    Then the doctrine content renders markdown text and interactive Mermaid diagrams
