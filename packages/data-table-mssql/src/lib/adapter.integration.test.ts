import { after, before, describe } from 'node:test'
import { createDatabase } from '@remix-run/data-table'
import sql, { type ConnectionPool } from 'mssql'

import { runAdapterIntegrationContract } from '../../../data-table/test/adapter-integration-contract.ts'

import { createMssqlDatabaseAdapter } from './adapter.ts'

let integrationEnabled =
  process.env.DATA_TABLE_INTEGRATION === '1' && typeof process.env.DATA_TABLE_MSSQL_URL === 'string'

describe('mssql adapter integration', () => {
  let pool: ConnectionPool

  before(async () => {
    if (!integrationEnabled) {
      return
    }

    pool = await sql.connect(process.env.DATA_TABLE_MSSQL_URL as string)

    await pool.request().query('if object_id(\'tasks\', \'U\') is not null drop table [tasks]')
    await pool.request().query('if object_id(\'projects\', \'U\') is not null drop table [projects]')
    await pool.request().query('if object_id(\'accounts\', \'U\') is not null drop table [accounts]')

    await pool.request().query(
      [
        'create table [accounts] (',
        '  [id] int primary key,',
        '  [email] nvarchar(255) not null,',
        '  [status] nvarchar(32) not null,',
        '  [nickname] nvarchar(255) null',
        ')',
      ].join('\n'),
    )

    await pool.request().query(
      [
        'create table [projects] (',
        '  [id] int primary key,',
        '  [account_id] int not null,',
        '  [name] nvarchar(255) not null,',
        '  [archived] bit not null',
        ')',
      ].join('\n'),
    )

    await pool.request().query(
      [
        'create table [tasks] (',
        '  [id] int primary key,',
        '  [project_id] int not null,',
        '  [title] nvarchar(255) not null,',
        '  [state] nvarchar(32) not null',
        ')',
      ].join('\n'),
    )
  })

  after(async () => {
    if (!integrationEnabled) {
      return
    }

    await pool.request().query('if object_id(\'tasks\', \'U\') is not null drop table [tasks]')
    await pool.request().query('if object_id(\'projects\', \'U\') is not null drop table [projects]')
    await pool.request().query('if object_id(\'accounts\', \'U\') is not null drop table [accounts]')
    await pool.close()
  })

  runAdapterIntegrationContract({
    integrationEnabled,
    createDatabase: () => createDatabase(createMssqlDatabaseAdapter(pool as never)),
    resetDatabase: async () => {
      await pool.request().query('delete from [tasks]')
      await pool.request().query('delete from [projects]')
      await pool.request().query('delete from [accounts]')
    },
  })
})
