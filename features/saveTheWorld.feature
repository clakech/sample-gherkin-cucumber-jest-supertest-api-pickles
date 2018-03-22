Feature: save the world
As a hero
I want to register
So that I can save the world

  Scenario: can't save the world
    Given An event tsunami in London
    When An intervention plan is claimed
    Then The intervention plan is empty

  Scenario: prevent tsunami
    Given A hero named "Bizarro Aquaman" with key 3ad75905-0565-42f8-b337-c7e9b8ae92be
    Given An event tsunami in London
    When An intervention plan is claimed
    Then The hero "Bizarro Aquaman" in London has action prevent

  Scenario: prevent 2 tsunamis
    Given A hero named "Bizarro Aquaman" with key 3ad75905-0565-42f8-b337-c7e9b8ae92be
    Given A hero named "Aquaria Neptunia" with key ccefd65a-0f7e-4a98-bffe-c6f9cc12ddd1
    Given An event tsunami in London
    Given An event tsunami in Paris
    When An intervention plan is claimed
    Then The hero "Bizarro Aquaman" in London has action prevent
    Then The hero "Aquaria Neptunia" in Paris has action prevent

  Scenario: prevent tsunami
    Given A hero named "Air Hero" with key 3ad75905-0565-42f8-b337-c7e9b8ae92be
    Given An event tsunami in London
    When An intervention plan is claimed
    Then The hero "Air Hero" in London has action repair

  Scenario: prevent meteorite
    Given A hero named "FerAlyce" with key 50f5943e-aac2-4c76-b116-f6cd2656a961
    Given An event meteorite in London
    When An intervention plan is claimed
    Then The hero "FerAlyce" in London has action prevent

  Scenario: prevent meteorite
    Given A hero named "Aang" with key 51ae4dac-c826-4503-b0f9-7b2ef9af69ef
    Given An event meteorite in London
    When An intervention plan is claimed
    Then The hero "Aang" in London has action prevent

  Scenario: repair meteorite
    Given A hero named "Aleister Hook" with key a534d762-0777-41d0-9571-eb8e5e021e29
    Given An event meteorite in Paris
    When An intervention plan is claimed
    Then The hero "Aleister Hook" in Paris has action repair
