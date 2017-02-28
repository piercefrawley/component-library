import { render } from 'react-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import React from 'react';

import Tatari from '../src';

const mockApi = new MockAdapter(axios);

import defaultStyles from '../src/TatariDefault.scss';
import sandboxStyles from './sandbox.scss';


mockApi
.onGet('/saved_filters')
  .reply(200, {})
.onGet('/available_filters')
  .reply(200, [
    {
      endpoint: '/filterA',
      key: 'ball_in_court_id',
      value: 'Ball In Court'
    },
    {
      endpoint: '/filterB',
      key: 'assignee',
      value: 'Assignee'
    }
  ])
.onGet('/filterA')
  .reply(200, [
      { key: 1309646, value: 'Test A' },
      { key: 1228193, value: "Test A'postrophe" },
      { key: 1188710, value: 'Test Add' },
      { key: 1273550, value: 'Full Admin' },
      { key: 1390306, value: 'Blah Blah' },
      { key: 1119508, value: 'Elizabeth Cannon' }
  ])
.onGet('/filterB')
  .reply(200, [
      { key: 649574, value: 'Litmus Litmus' },
      { key: 1202971, value: 'Test McTest' },
      { key: 1133792, value: 'Northern Mockingbird' },
      { key: 582118, value: 'Nautica Sales' },
      { key: 1133787, value: 'Western Scrubjay' },
      { key: 1202938, value: 'Ultimate Test' },
      { key: 1133776, value: 'California Towhee' }
  ]);

const urls = {
  saved: '/saved_filters',
  available: '/available_filters'
};

const onComplete = () => {
  console.warn("External onFetch called.");  // eslint-disable-line
};

const stylesheets = [
  defaultStyles,
  sandboxStyles
];

render(
  <Tatari {...{ urls, onComplete, stylesheets }} />,
  document.getElementById('root'),
);
