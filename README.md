<p align="center">
  <a href="https://github.com/jwulf/ghettohubDB/actions"><img alt="typescript-action status" src="https://github.com/jwulf/ghettohubDB/workflows/build-test/badge.svg"></a>
</p>

# A JSON DB in a GitHub repo via GitHub Actions

**Definitely _not_ webscale.**

With this GitHub Action you can use a GitHub repo as an extremely low-fi JSON DB.

The action will perform db operations on JSON data stored as flat files (one file per table).

It doesn't handle git merge conflicts yet, so simultaneous workflows may cause operations to fail.

## Use

Supported operations:

| Operation | Required parameters | Optional parameters |
| --- | ---| --- |
| FINDONE | operation, table, query | |
| FINDMANY | operation, table, query | |
| DROPTABLE | operation, table, github_token | |
| UPSERT  | operation, table, record, github_token | query |
| DELETEONE | operation, table, query, github_token | |
| DELETEMANY | operation, table, query, github_token | |
| INIT  | operation  | |
| UPDATEONE   |operation, table, query, record, github_token | |
| UPDATEMANY  |operation, table, query, record, github_token | |

* Upsert a new record:

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
          table: customers
```

Example output: 

```
{"name":"Joe Bloggs","address":"The Dog House","_updated":"Fri Feb 14 2020 12:27:53 GMT+0000 (Coordinated Universal Time)","_id":"80256a29-9b7f-458a-a781-5d9ae7077d0d"}
```

* Find a record:

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
