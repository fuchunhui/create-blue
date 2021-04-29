#!/usr/bin/env node

// @ts-check
const path = require('path')
const fs = require('fs')
const argv = require('minimist')(process.argv.slice(2))
const {prompt} = require('enquirer')
const cwd = process.cwd()

const {
  blue,
  green,
  red,
  cyan
} = require('kolorist')

const TEMPLATES = [
  {
    name: 'vite',
    color: green
  },
  {
    name: 'doc',
    color: red
  },
  {
    name: 'md',
    color: blue
  }
]

const templateNameList = TEMPLATES.map(t => [t.name]).reduce((a, b) => a.concat(b), [])

async function init() {
  let targetDir = argv._[0]
  if (!targetDir) {
    /**
     * @type {{ projectName: string }}
     */
    const { projectName } = await prompt({
      type: 'input',
      name: 'projectName',
      message: `Project name:`,
      initial: 'blue-project'
    })
    targetDir = projectName
  }
  const packageName = await getValidPackageName(targetDir)
  const root = path.join(cwd, targetDir)

  if (!fs.existsSync(root)) {
    fs.mkdirSync(root, { recursive: true })
  } else {
    const existing = fs.readdirSync(root)
    if (existing.length) {
      /**
       * @type {{ yes: boolean }}
       */
      const { yes } = await prompt({
        type: 'confirm',
        name: 'yes',
        initial: 'Y',
        message:
          (targetDir === '.'
            ? 'Current directory'
            : `Target directory ${targetDir}`) +
          ' is not empty.\n' +
          'Remove existing files and continue?'
      })
      if (yes) {
        emptyDir(root)
      } else {
        return
      }
    }
  }

  let templateName = argv.template
  if (typeof templateName === 'string' && !templateNameList.includes(templateName)) {
    console.log(`${templateName} isn't a valid template. Please choose from below:`)
    templateName = '';
  }

  if (!templateName) {
    /**
     * @type {{ template: string }}
     */
    const { template } = await prompt({
      type: 'select',
      name: 'template',
      message: 'Select a template:',
      format(name) {
        const template = TEMPLATES.find(v => v.name === name)
        return template
          ? template.color(template.name)
          : name
      },
      choices: TEMPLATES.map(t => ({
        name: t.name,
        value: t.name,
        message: t.color(t.name)
      }))
    })
    templateName = template
  }

  console.log(cyan(`\nScaffolding project in ${root}...`))

  const templateDir = path.join(__dirname, `template-${templateName}`)
  const write = (file, content) => {
    const targetPath = path.join(root, file)
    if (content) {
      fs.writeFileSync(targetPath, content)
    } else {
      copy(path.join(templateDir, file), targetPath)
    }
  }

  const files = fs.readdirSync(templateDir)
  for (const file of files.filter(f => f !== 'package.json')) {
    write(file)
  }
  const pkg = require(path.join(templateDir, `package.json`))
  pkg.name = packageName
  write('package.json', JSON.stringify(pkg, null, 2))

  console.log(green(`\nDone. Now run:\n`))
  if (root !== cwd) {
    console.log(`  cd ${path.relative(cwd, root)}`)
  }
  console.log(`  npm install`)
  console.log(`  npm run dev\n`)
}

function copy(src, dest) {
  const stat = fs.statSync(src)
  if (stat.isDirectory()) {
    copyDir(src, dest)
  } else {
    fs.copyFileSync(src, dest)
  }
}

function copyDir(srcDir, destDir) {
  fs.mkdirSync(destDir, { recursive: true })
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file)
    const destFile = path.resolve(destDir, file)
    copy(srcFile, destFile)
  }
}

function emptyDir(dir) {
  if (!fs.existsSync(dir)) {
    return
  }
  for (const file of fs.readdirSync(dir)) {
    const abs = path.resolve(dir, file)
    if (fs.lstatSync(abs).isDirectory()) {
      emptyDir(abs)
      fs.rmdirSync(abs)
    } else {
      fs.unlinkSync(abs)
    }
  }
}

async function getValidPackageName(projectName) {
  const packageNameRegExp = /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/
  if (packageNameRegExp.test(projectName)) {
    return projectName
  } else {
    const suggestedPackageName = projectName
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/^[._]/, '')
      .replace(/[^a-z0-9-~]+/g, '-')

    /**
     * @type {{ inputPackageName: string }}
     */
    const { inputPackageName } = await prompt({
      type: 'input',
      name: 'inputPackageName',
      message: `Package name:`,
      initial: suggestedPackageName,
      validate: (input) =>
        packageNameRegExp.test(input) ? true : 'Invalid package.json name'
    })
    return inputPackageName
  }
}

init().catch((e) => {
  console.error(e)
})
