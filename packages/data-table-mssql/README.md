# data-table-mssql

MSSQL adapter for [`remix/data-table`](https://github.com/remix-run/remix/tree/main/packages/data-table).
Use this package when you want `data-table` APIs backed by `mssql`.

## Features

- **Native `mssql` Integration**: Works with `ConnectionPool`
- **Full `data-table` API Support**: Queries, relations, writes, and transactions
- **MSSQL Capabilities Enabled By Default**:
  - `returning: false`
  - `savepoints: true`
  - `upsert: true`

## Installation

```sh
npm i remix mssql
```

## Usage

```ts
import sql from 'mssql'
import { createDatabase } from 'remix/data-table'
import { createMssqlDatabaseAdapter } from 'remix/data-table-mssql'

let pool = await sql.connect(process.env.DATABASE_URL)

let db = createDatabase(createMssqlDatabaseAdapter(pool))
```

Use `db.query(...)`, relation loading, and transactions from `remix/data-table`.

## Adapter Capabilities

`data-table-mssql` reports this capability set by default:

- `returning: false`
- `savepoints: true`
- `upsert: true`

## Advanced Usage

### Transaction Options

Transaction options are passed through to the adapter as hints.

```ts
await db.transaction(async (txDb) => txDb.exec('select 1'), {
  isolationLevel: 'serializable',
  readOnly: false,
})
```

### Capability Overrides For Testing

You can override capabilities to verify fallback paths in tests.

```ts
import { createMssqlDatabaseAdapter } from 'remix/data-table-mssql'

let adapter = createMssqlDatabaseAdapter(pool, {
  capabilities: {
    returning: true,
  },
})
```

## Related Packages

- [`data-table`](https://github.com/remix-run/remix/tree/main/packages/data-table) - Core query/relations API
- [`data-schema`](https://github.com/remix-run/remix/tree/main/packages/data-schema) - Schema definitions and validation
- [`data-table-mysql`](https://github.com/remix-run/remix/tree/main/packages/data-table-mysql) - MySQL adapter
- [`data-table-sqlite`](https://github.com/remix-run/remix/tree/main/packages/data-table-sqlite) - SQLite adapter

## License

See [LICENSE](https://github.com/remix-run/remix/blob/main/LICENSE)
