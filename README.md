<p align="center">
  <a href="https://github.com/jwulf/ghettohubDB/actions"><img alt="typescript-action status" src="https://github.com/jwulf/ghettohubDB/workflows/build-test/badge.svg"></a>
</p>

# A JSON DB in a GitHub repo via GitHub Actions

**Definitely _not_ webscale.**

With this GitHub Action you can use a GitHub repo as an extremely low-fi JSON DB.

The action will perform db operations on JSON data stored as flat files (one file per table). At the end of the workflow you should use [stefanzweifel/git-auto-commit-action](https://github.com/stefanzweifel/git-auto-commit-action) to commit the database transaction to the repo.

It doesn't handle file conflicts yet, so simultaneous workflows will cause operations to fail.

## Use

Supported operations:

* FINDONE 
* FINDMANY 
* DROPTABLE 
* UPSERT 
* DELETEONE 
* DELETEMANY 
* INIT 
* UPDATEONE 
* UPDATEMANY

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
