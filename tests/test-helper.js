import './helpers/flash-message';
// import Application from '../app';
// import config from '../config/environment';
import Application from 'my-app/app';
import config from 'my-app/config/environment';
import { setApplication } from '@ember/test-helpers';
import { start } from 'ember-qunit';

setApplication(Application.create(config.APP));

start();
