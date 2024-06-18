import { Router } from 'express'
import fs from 'fs'
import path from 'path'

interface FileRoute {
  router: Router
  endpoint: string
}

const EXCLUDED = ['index']

const processRoutes = (_router: Router) => {
  try {
    const files = fs.readdirSync(path.join(__dirname), { withFileTypes: true })
    for (const file of files) {
      if (EXCLUDED.some(name => file.name.startsWith(name))) continue

      const { router, endpoint }: FileRoute = require(path.join(__dirname, file.name))
      console.log({ endpoint })

      _router.use(endpoint, router)
    }
    return _router
  } catch (err) {
    console.log({ err })
    throw new Error('\x1b[31mThere was an error when trying to import v1 routes \x1b[0m')
  }
}

export const apiV1Router = processRoutes(Router())
