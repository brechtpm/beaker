import {app} from 'electron'
import sqlite3 from 'sqlite3'
import path from 'path'
import fs from 'fs'
import {cbPromise} from '../../lib/functions'
import {setupSqliteDB} from '../../lib/bg/db'

// globals
// =

var db
var migrations
var setupPromise

// exported methods
// =

export function setup () {
  // open database
  var dbPath = path.join(app.getPath('userData'), 'Profiles')
  db = new sqlite3.Database(dbPath)
  setupPromise = setupSqliteDB(db, {setup: setupDb, migrations}, '[PROFILES]')
}

export async function get (...args) {
  await setupPromise
  return cbPromise(cb => db.get(...args, cb))
}

export async function all (...args) {
  await setupPromise
  return cbPromise(cb => db.all(...args, cb))
}

export async function run (...args) {
  await setupPromise
  return cbPromise(cb => db.run(...args, cb))
}

export function serialize () {
  return db.serialize()
}

export function parallelize () {
  return db.parallelize()
}

// internal methods
// =

function setupDb (cb) {
  db.exec(fs.readFileSync(path.join(__dirname, 'background-process', 'dbs', 'schemas', 'profile-data.sql'), 'utf8'), cb)
}
migrations = [
  migration('profile-data.v1.sql'),
  migration('profile-data.v2.sql'),
  migration('profile-data.v3.sql'),
  migration('profile-data.v4.sql'),
  migration('profile-data.v5.sql'),
  migration('profile-data.v6.sql'),
  migration('profile-data.v7.sql'),
  migration('profile-data.v8.sql'),
  migration('profile-data.v9.sql'),
  migration('profile-data.v10.sql'),
  migration('profile-data.v11.sql'),
  migration('profile-data.v12.sql'),
  migration('profile-data.v13.sql'),
  migration('profile-data.v14.sql'),
  migration('profile-data.v15.sql')
]
function migration (file) {
  return cb => db.exec(fs.readFileSync(path.join(__dirname, 'background-process', 'dbs', 'schemas', file), 'utf8'), cb)
}
