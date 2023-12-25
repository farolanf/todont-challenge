import fs from 'node:fs'
import path from 'node:path'
import { exit } from 'node:process'

const prjDir = path.resolve(path.dirname(process.argv[1]), '..')

const inputFile = `${prjDir}/artifacts/contracts/Todont.sol/Todont.json`

if (!fs.existsSync(inputFile)) {
  console.log(`Missing input file ${inputFile}. Please run 'npm run compile'.`)
  exit(1)
}

const outputFile = process.argv[2]

if (!outputFile) {
  console.error(`Usage: node ${path.basename(process.argv[1])} <output-file>`)
  exit(1)
}

const todont = JSON.parse(fs.readFileSync(inputFile, 'utf8'))

fs.writeFileSync(outputFile, JSON.stringify(todont.abi, null, 2))
