import { put, select, takeLatest } from 'redux-saga/effects';
// import { delay } from 'redux-saga';
import { push } from 'react-router-redux';
import { authCall } from '../../../../shared/services/api/api';

import { REQUEST_INCIDENTS, INCIDENT_SELECTED } from './constants';
import { requestIncidentsSuccess, requestIncidentsError, filterIncidentsChanged, pageIncidentsChanged } from './actions';
import { makeSelectFilterParams } from './selectors';

export function* fetchIncidents(action) {
  const requestURL = 'https://acc.api.data.amsterdam.nl/signals/auth/signal';
  // const requestURL = 'https://acc.api.data.amsterdam.nl/dcatd/openapi';
  // const requestURL = '/api/auth/signal/';

  try {
    const filter = action.payload.filter;
    if (filter) yield put(filterIncidentsChanged(filter));
    const page = action.payload.page;
    if (page) yield put(pageIncidentsChanged(page));
    const params = yield select(makeSelectFilterParams());
    const incidents = yield authCall(requestURL, params);

    yield put(requestIncidentsSuccess(incidents));
  } catch (err) {
    yield put(requestIncidentsError(err));
  }
}

export function* openIncident(action) {
  const incident = action.payload;
  const navigateUrl = `incident/${incident.id}`;
  yield put(push(navigateUrl));
}

export default function* watchRequestIncidentsSaga() {
  yield [
    takeLatest(REQUEST_INCIDENTS, fetchIncidents),
    takeLatest(INCIDENT_SELECTED, openIncident)
  ];
}
