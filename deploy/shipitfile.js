const path = require('path')
const minimist = require('minimist')

var args = minimist(process.argv.slice(2));
console.log(args)

module.exports = shipit => {
  require('shipit-deploy')(shipit)
  require('shipit-pm2')(shipit)
  require('shipit-slack')(shipit)

  shipit.initConfig({
    default: {
      repositoryUrl: 'git@gitlab.com:clearview/root.git',
      keepReleases: 10,
      /*
      deploy: {
        remoteCopy: {
          copyAsDir: false, // Should we copy as the dir (true) or the content of the dir (false)
          rsync: ['--no-perms --no-owner --no-group --rsync-path="/usr/bin/rsync"'],
          verboseSSHLevel: 0,
        }
      },
      rsync: ['--no-perms --no-owner --no-group --rsync-path="/usr/bin/rsync"'],
      */
      slack: {
        webhookUrl: 'https://hooks.slack.com/services/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',
        message: 'Root app deployed',
        triggerEvent: 'deployed'
      }
    },
    production: {
      deployTo: '/srv/root',
      servers: 'rut@rootspace.app',
      pm2: {
        json: '/srv/root/current/api/pm2/production.json'
      }
    }
  })

  shipit.on('fetched', () => {
    console.log('\n')
    if (args.branch) {
        shipit.config.branch = args.branch;
    }
    console.log(args.branch)
    console.log('\n')

  });

  shipit.on('deploy', function() {
      if (args.branch) {
          shipit.config.branch = args.branch;
      }
  });

  shipit.on('updated', function () {
    console.log('Build project...')
    shipit.start('app:build')
  })

  shipit.blTask('app:build', async () => {
    const releaseDir = path.join(shipit.releasesPath, shipit.releaseDirname)
    const env = shipit.options.environment
    console.log(shipit.releaseDirname)

    await shipit.remote(`cd ${releaseDir} && cp /srv/root_prod/api/.env ./api/.env`)
    await shipit.remote(`cd ${releaseDir}/api && yarn install`)
    await shipit.remote(`cd ${releaseDir}/api && NODE_ENV=${env} yarn run build`)

    await shipit.remote(`cd ${releaseDir}/api && NODE_ENV=${env} yarn run typeorm migration:run`)

    await shipit.remote(`cd ${releaseDir} && cp /srv/root_prod/web/.env ./web/.env`)
    await shipit.remote(`cd ${releaseDir}/web && yarn install`)
    await shipit.remote(`cd ${releaseDir}/web && NODE_ENV=${env} yarn run build`)
  })
}
