<p align="center">
  <a href="https://github.com/jwulf/ghettohubDB/actions"><img alt="typescript-action status" src="https://github.com/jwulf/ghettohubDB/workflows/build-test/badge.svg"></a>
</p>

# A JSON DB in a GitHub repo via GitHub Actions

**Definitely _not_ webscale.**

With this GitHub Action you can use a GitHub repo as an extremely low-fi JSON DB.

The action will perform db operations on JSON data stored as flat files (one file per table).

It doesn't handle git merge conflicts yet, so simultaneous workflows may cause operations to fail.

## Tables

Tables are `${tablename}.json` documents stored in `${basedir}` in the repo. You can specify a custom directory if you want.

## Operations

Supported operations:

| Operation | Required parameters | Optional parameters |
| --- | ---| --- |
| `FINDONE` | `operation`, `table`, `query` | `basedir` |
| `FINDMANY` | `operation`, `table`, `query` | `basedir` |
| `DROP`TABLE`` | `operation`, `table`, `github_token` | `basedir` |
| `UPSERT`  | `operation`, `table`, record, `github_token` | `query`, `basedir` |
| `DELETEONE` | `operation`, `table`, `query`, `github_token` | `basedir` |
| `DELETEMANY` | `operation`, `table`, `query`, `github_token` | `basedir` |
| `INIT`  | `operation`  | |
| `UPDATEONE`   |`operation`, `table`, `query`, record, `github_token` | `basedir` |
| `UPDATEMANY`  |`operation`, `table`, `query`, record, `github_token` | `basedir` |

## Query Syntax

Queries can be used to retrieve one or records, selectively update one or more records, delete one or more records, or determine whether or not an UPSERT operation creates a new record or updates an existing one.

The query syntax is simple: you pass in a JSON shallow JSON document, and any document that matches that will be returned. In the case of `UPSERT`, `FINDONE`, `DELETEONE`, and `UPDATEONE`, the first match will be used.

New records have a UUID assigned to them as the `_id` field. 

If no query is specified for `UPSERT` then the assigned `_id` field will be used, if the record you send in has one. This way you can retrieve a record, update it, then send it back in an `UPSERT` operation, and _know_ that it will update the existing record.

## Output

The output of operations is available it `outputs.result`. It is a stringified JSON document. See the Find Record example below.

## Examples

### Create a new record

With no `_id` field on the record, and no `query` argument, `UPSERT` will always create a new record.

```
name: Create record

on: [repository_dispatch]

jobs:
  upsert:
    if: github.event.action == 'upsert'
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2
      - name: Upsert record
        uses: jwulf/ghettohubDB@master
        with:
          operation: UPSERT
          github_token: ${{ secrets.GITHUB_TOKEN }}
          record: '{"name": "Joe Bloggs", "address": "The Dog House"}'
          table: customers
```

Example output: 

```
{"name":"Joe Bloggs","address":"The Dog House","_updated":"Fri Feb 14 2020 12:27:53 GMT+0000 (Coordinated Universal Time)","_id":"80256a29-9b7f-458a-a781-5d9ae7077d0d"}
```

## Upsert a record

To make sure you don't create two customer records for Joe Bloggs, you can pass a `query` parameter to the operation to let it know it should update the existing record it finds with `{"name": "Joe Bloggs"}`, otherwise create a new one:

```
name: Upsert record

on: [repository_dispatch]

jobs:
  upsert:
    if: github.event.action == 'upsert'
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2
      - name: Upsert record
        uses: jwulf/ghettohubDB@master
        with:
          operation: UPSERT
          github_token: ${{ secrets.GITHUB_TOKEN }}
          record: '{"name": "Joe Bloggs", "address": "The Dog House"}'
          query: '{"name": "Joe Bloggs"}'
          table: customers
```

## Find a record:

```
name: Find record

on: [repository_dispatch]

jobs:
  find:
    if: github.event.action == 'find'
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2
      - name: Find record
        id: find-operation
        uses: jwulf/ghettohubDB@master
        with:
          operation: FINDONE
          query: '{"name": "Joe Bloggs"}'
          table: customers
      - name: Echo out record
        run: echo ${{ steps.find-operation.outputs.result }}
```

Example output:

```
{"found":true,"count":1,"record":{"name":"Joe Bloggs","address":"The Dog House","_updated":"Fri Feb 14 2020 12:47:16 GMT+0000 (Coordinated Universal Time)","_id":"a83936ee-f06c-46f2-b5ec-8e0b2e3367a1"}}
```

## Updating records
