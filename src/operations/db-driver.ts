import fs from 'fs'

type DBTableData = JSONDoc[]
export interface JSONDoc {
  [key: string]: string | number | JSONDoc | JSONDoc[]
}
export class DatabaseDriver {
  basedir: string
  constructor(basedir: string) {
    if (!fs.existsSync(`./${basedir}`)) {
      fs.mkdirSync(`./${basedir}`, {recursive: true})
    }
    this.basedir = `./${basedir}`
  }

  dropTable(tablename: string): void {
    const filename = this.getTableFile(tablename)
    if (fs.existsSync(filename)) {
      fs.unlinkSync(filename)
    }
  }

  readTable(tablename: string): DBTableData {
    const filename = this.getTableFile(tablename)
    if (fs.existsSync(filename)) {
      return JSON.parse(fs.readFileSync(filename, 'utf8'))
    }
    return []
  }

  flushTable(tablename: string, tableData: any): void {
    const tableFile = this.getTableFile(tablename)
    fs.writeFileSync(tableFile, JSON.stringify(tableData, null, 2))
  }

  private getTableFile(tablename: string): string {
    return `${this.basedir}/${tablename}.json`
  }
}
