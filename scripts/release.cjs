
const sh = require('./shared.cjs')

const version = process.argv[2] || 'patch'
const branch = sh.read('git rev-parse --abbrev-ref HEAD')
const dirty = !!sh.read('git diff --stat')

if (![ 'patch', 'minor', 'major' ].includes(version)) {
  sh.exit('Invalid version ' + version)
}

if (branch !== 'master') {
  sh.exit('Branch must be master')
}

if (dirty) {
  sh.exit('Branch is dirty')
}

sh.info('Bump version')
sh.exec('npm version ' + version + ' -m "Release patch v%s"')

sh.info('Build bundles')
sh.exec('npm run build')

sh.info('Publish to NPM')
sh.exec('npm publish')

sh.info('Push to Github')
sh.exec('git push origin master --tags')
