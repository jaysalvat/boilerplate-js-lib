const fs = require('fs')
const Case = require('case')
const ROOT = __dirname + '/../'

function replaceInFile(file, name) {
  const content = fs.readFileSync(file, 'utf8')
  let result = content

  result = result.replace(new RegExp('project name', 'g'), name)
  result = result.replace(new RegExp('project_name', 'g'), Case.snake(name))
  result = result.replace(new RegExp('project-name', 'g'), Case.kebab(name))
  result = result.replace(new RegExp('ProjectName', 'g'), Case.pascal(name))
  result = result.replace(new RegExp('projectName', 'g'), Case.camel(name))

  fs.writeFileSync(file, result)
}

function getFiles(folder) {
  return fs.readdirSync(folder, { withFileTypes: true })
    .filter((found) => found.isFile())
    .map((file) => file.name)
}

const readline = require('readline')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

rl.question('Name of the project:', function (name) {
  console.log('')

  getFiles(ROOT).forEach((file) => {
    console.log('Replacing in', file)
    replaceInFile(file, name)
  })

  rl.close()
})
