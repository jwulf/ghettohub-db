import fs from 'fs'

type DBTableData = JSONDoc[]
export interface JSONDoc {
  [key: string]: string | number | boolean | JSONDoc | JSONDoc[]
}

export class DatabaseDriver {
  basedir: string
  dirty = false
  constructor(basedir: string) {
    if (!fs.existsSync(`./${basedir}`)) {
      fs.mkdirSync(`./${basedir}`, {recursive: true})
    }
    this.basedir = `./${basedir}`
  }

  dropTable(tablename: string): void {
    const dir = this.getTableDirectory(tablename)
    if (fs.existsSync(dir)) {
      fs.rmdirSync(dir, {recursive: true})
    }
  }

  readTable(tablename: string): DBTableData {
    const dir = this.getTableDirectory(tablename)
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir)
      const table: JSONDoc[] = files.map(
        (file): JSONDoc => JSON.parse(fs.readFileSync(`${dir}/${file}`, 'utf8'))
      )
      return table
    }
    return []
  }

  flushTable(tablename: string, tableData: JSONDoc[]): void {
    const dir = this.getTableDirectory(tablename)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {recursive: true})
    }
    for (const record of tableData || []) {
      if (record.__dirty) {
        delete record.__dirty
        fs.writeFileSync(
          `${dir}/${record._id}.json`,
          JSON.stringify(record, null, 2)
        )
        this.dirty = true
      }
      if (record.__delete) {
        fs.unlinkSync(`${dir}/${record._id}.json`)
        this.dirty = true
      }
    }
  }

  private getTableDirectory(tablename: string): string {
    return `${this.basedir}/${tablename}`
  }
}
