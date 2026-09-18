import * as migration_20260917_221015_initial from './20260917_221015_initial';

export const migrations = [
  {
    up: migration_20260917_221015_initial.up,
    down: migration_20260917_221015_initial.down,
    name: '20260917_221015_initial'
  },
];
