// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router/immutable'
import * as Sentry from '@sentry/browser'
import { MatomoProvider, createInstance } from '@datapunt/matomo-tracker-react'
import history from 'utils/history'

// Import root app
import App from 'containers/App'
import { authenticateUser } from 'containers/App/actions'
import { authenticate } from 'shared/services/auth/auth'
import configuration from 'shared/services/configuration/configuration'
import loadModels from 'models'

// Import CSS and Global Styles
import './global.css'
import './polyfills'

import configureStore from './configureStore'

const environment = process.env.BUILD_ENV
const dsn = configuration?.sentry?.dsn
const release = process.env.FRONTEND_TAG

if (dsn) {
  Sentry.init({
    environment,
    dsn,
    release,
    autoSessionTracking: false,
  })
}

// Create redux store with history
const initialState = {}
const store = configureStore(initialState, history)
const MOUNT_NODE = document.getElementById('app')

loadModels(store)

const render = () => {
  const domainTag = process.env.DOMAIN_TAG
  const tags = [
    release && `frontend tag: ${release}`,
    domainTag && `domain tag: ${domainTag}`,
  ].filter(Boolean)

  // eslint-disable-next-line no-console
  if (tags.length > 0) console.log(tags.join('\n'))

  const urlBase = configuration?.matomo?.urlBase
  const siteId = configuration?.matomo?.siteId

  const spinner = document.getElementById('spinner')
  const spinnerBackground = document.getElementById('spinner-background')
  spinner.remove()
  spinnerBackground.remove()

  if (urlBase && siteId) {
    const matomoInstance = createInstance({
      urlBase,
      siteId,
    })

    ReactDOM.render(
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <MatomoProvider value={matomoInstance}>
            <App />
          </MatomoProvider>
        </ConnectedRouter>
      </Provider>,
      MOUNT_NODE
    )
  } else {
    ReactDOM.render(
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <App />
        </ConnectedRouter>
      </Provider>,
      MOUNT_NODE
    )
  }
}

const registerServiceWorkerProxy = () => {
  if ('serviceWorker' in navigator && process.env.PROXY) {
    navigator.serviceWorker.register('/sw-proxy.js')
  }
}

const unregisterServiceWorkers = () => {
  // Removes legacy service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function (registrations) {
      for (let registration of registrations) {
        registration.unregister()
      }
    })
  }
}

if (module.hot) {
  // Hot reloadable React components and translation json files
  // modules.hot.accept does not accept dynamic dependencies,
  // have to be constants at compile-time
  module.hot.accept()
}

// Authenticate and start the authorization process
authenticate()
  .then((credentials) => store.dispatch(authenticateUser(credentials)))
  .finally(() => {
    render()

    unregisterServiceWorkers()
    registerServiceWorkerProxy()
  })
  .catch(() => {})
