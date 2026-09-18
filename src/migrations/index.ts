import * as migration_20260917_221015_initial from './20260917_221015_initial';
import * as migration_20260918_091644_pricing_and_case_study_structure from './20260918_091644_pricing_and_case_study_structure';
import * as migration_20260918_192520_free_marketing_audit from './20260918_192520_free_marketing_audit';

export const migrations = [
  {
    up: migration_20260917_221015_initial.up,
    down: migration_20260917_221015_initial.down,
    name: '20260917_221015_initial',
  },
  {
    up: migration_20260918_091644_pricing_and_case_study_structure.up,
    down: migration_20260918_091644_pricing_and_case_study_structure.down,
    name: '20260918_091644_pricing_and_case_study_structure',
  },
  {
    up: migration_20260918_192520_free_marketing_audit.up,
    down: migration_20260918_192520_free_marketing_audit.down,
    name: '20260918_192520_free_marketing_audit'
  },
];
