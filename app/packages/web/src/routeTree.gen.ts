/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as IndexImport } from './routes/index'
import { Route as NotificationsIndexImport } from './routes/notifications/index'
import { Route as DatabasesIndexImport } from './routes/databases/index'
import { Route as AlarmsIndexImport } from './routes/alarms/index'
import { Route as MoreSettingsImport } from './routes/_more/settings'
import { Route as MoreSupportTutorialsImport } from './routes/_more/support/tutorials'
import { Route as MoreSupportDocsImport } from './routes/_more/support/docs'
import { Route as MoreSupportContactImport } from './routes/_more/support/contact'

// Create/Update Routes

const IndexRoute = IndexImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const NotificationsIndexRoute = NotificationsIndexImport.update({
  path: '/notifications/',
  getParentRoute: () => rootRoute,
} as any)

const DatabasesIndexRoute = DatabasesIndexImport.update({
  path: '/databases/',
  getParentRoute: () => rootRoute,
} as any)

const AlarmsIndexRoute = AlarmsIndexImport.update({
  path: '/alarms/',
  getParentRoute: () => rootRoute,
} as any)

const MoreSettingsRoute = MoreSettingsImport.update({
  path: '/settings',
  getParentRoute: () => rootRoute,
} as any)

const MoreSupportTutorialsRoute = MoreSupportTutorialsImport.update({
  path: '/support/tutorials',
  getParentRoute: () => rootRoute,
} as any)

const MoreSupportDocsRoute = MoreSupportDocsImport.update({
  path: '/support/docs',
  getParentRoute: () => rootRoute,
} as any)

const MoreSupportContactRoute = MoreSupportContactImport.update({
  path: '/support/contact',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/_more/settings': {
      id: '/_more/settings'
      path: '/settings'
      fullPath: '/settings'
      preLoaderRoute: typeof MoreSettingsImport
      parentRoute: typeof rootRoute
    }
    '/alarms/': {
      id: '/alarms/'
      path: '/alarms'
      fullPath: '/alarms'
      preLoaderRoute: typeof AlarmsIndexImport
      parentRoute: typeof rootRoute
    }
    '/databases/': {
      id: '/databases/'
      path: '/databases'
      fullPath: '/databases'
      preLoaderRoute: typeof DatabasesIndexImport
      parentRoute: typeof rootRoute
    }
    '/notifications/': {
      id: '/notifications/'
      path: '/notifications'
      fullPath: '/notifications'
      preLoaderRoute: typeof NotificationsIndexImport
      parentRoute: typeof rootRoute
    }
    '/_more/support/contact': {
      id: '/_more/support/contact'
      path: '/support/contact'
      fullPath: '/support/contact'
      preLoaderRoute: typeof MoreSupportContactImport
      parentRoute: typeof rootRoute
    }
    '/_more/support/docs': {
      id: '/_more/support/docs'
      path: '/support/docs'
      fullPath: '/support/docs'
      preLoaderRoute: typeof MoreSupportDocsImport
      parentRoute: typeof rootRoute
    }
    '/_more/support/tutorials': {
      id: '/_more/support/tutorials'
      path: '/support/tutorials'
      fullPath: '/support/tutorials'
      preLoaderRoute: typeof MoreSupportTutorialsImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren({
  IndexRoute,
  MoreSettingsRoute,
  AlarmsIndexRoute,
  DatabasesIndexRoute,
  NotificationsIndexRoute,
  MoreSupportContactRoute,
  MoreSupportDocsRoute,
  MoreSupportTutorialsRoute,
})

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/_more/settings",
        "/alarms/",
        "/databases/",
        "/notifications/",
        "/_more/support/contact",
        "/_more/support/docs",
        "/_more/support/tutorials"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/_more/settings": {
      "filePath": "_more/settings.tsx"
    },
    "/alarms/": {
      "filePath": "alarms/index.tsx"
    },
    "/databases/": {
      "filePath": "databases/index.tsx"
    },
    "/notifications/": {
      "filePath": "notifications/index.tsx"
    },
    "/_more/support/contact": {
      "filePath": "_more/support/contact.tsx"
    },
    "/_more/support/docs": {
      "filePath": "_more/support/docs.tsx"
    },
    "/_more/support/tutorials": {
      "filePath": "_more/support/tutorials.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
