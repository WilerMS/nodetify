import { Router } from 'express'
import fs from 'fs'
import path from 'path'

const EXCLUDED = ['index.ts']

const processRoutes = (router: Router) => {
  try {
    const files = fs.readdirSync(path.join(__dirname), { withFileTypes: true })
    for (const file of files) {
      if (EXCLUDED.includes(file.name)) continue

      const routeModule: Router = require(path.join(__dirname, file.name)).default

      const url = file.name.split('.')[0]
      router.use(`/${url}`, routeModule)
    }
    return router
  } catch (err) {
    console.log({ err })
    throw new Error('\x1b[31mThere was an error when trying to import v1 routes \x1b[0m')
  }
}

export const apiV1Router = processRoutes(Router())
