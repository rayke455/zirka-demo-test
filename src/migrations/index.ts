import * as migration_20260917_221015_initial from './20260917_221015_initial';
import * as migration_20260918_091644_pricing_and_case_study_structure from './20260918_091644_pricing_and_case_study_structure';
import * as migration_20260918_192520_free_marketing_audit from './20260918_192520_free_marketing_audit';
import * as migration_20260918_214839_stage3_and_maintenance from './20260918_214839_stage3_and_maintenance';
import * as migration_20260919_030446_stage4_fields from './20260919_030446_stage4_fields';
import * as migration_20260919_071342_ga_measurement_id from './20260919_071342_ga_measurement_id';

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
    name: '20260918_192520_free_marketing_audit',
  },
  {
    up: migration_20260918_214839_stage3_and_maintenance.up,
    down: migration_20260918_214839_stage3_and_maintenance.down,
    name: '20260918_214839_stage3_and_maintenance',
  },
  {
    up: migration_20260919_030446_stage4_fields.up,
    down: migration_20260919_030446_stage4_fields.down,
    name: '20260919_030446_stage4_fields',
  },
  {
    up: migration_20260919_071342_ga_measurement_id.up,
    down: migration_20260919_071342_ga_measurement_id.down,
    name: '20260919_071342_ga_measurement_id'
  },
];
