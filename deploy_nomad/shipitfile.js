const path = require('path')

module.exports = shipit => {
  require('shipit-deploy')(shipit)

  shipit.initConfig({
    default: {
      repositoryUrl: 'git@gitlab.com:clearview/root.git',
      keepReleases: 10,
      deploy: {
        remoteCopy: {
          copyAsDir: false, // Should we copy as the dir (true) or the content of the dir (false)
          rsync: ['--no-perms --no-owner --no-group --rsync-path="/usr/bin/rsync"'],
          verboseSSHLevel: 0,
        }
      },
      rsync: ['--no-perms --no-owner --no-group --rsync-path="/usr/bin/rsync"'],
      slack: {
        webhookUrl: 'https://hooks.slack.com/services/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',
        message: 'flow app deployed',
        triggerEvent: 'deployed'
      }
    },
    staging: {
      deployTo: '/srv/root',
      servers: 'rut@server.root.prod.clearviewdev.io',
      branch: 'dockerize'
    },
    staging_postgres: {
      deployTo: '/srv/root',
      verboseSSHLevel: 0,
      servers: 'rut@server.root.prod.clearviewdev.io',
      branch: 'dockerize'
    },
    staging_certbot: {
      deployTo: '/srv/root',
      verboseSSHLevel: 0,
      servers: 'rut@server.root.prod.clearviewdev.io',
      branch: 'dockerize'
    },
    production: {
      deployTo: '/srv/root',
      servers: 'rut@',
      branch: 'dockerize'
    }
  })

  shipit.on('fetched', () => {
    console.log('\n')
  });

  shipit.on('updated', function () {
    console.log('Build project...')
    shipit.start('app:build')
  })

  shipit.blTask('app:build', async () => {
    const releaseDir = path.join(shipit.releasesPath, shipit.releaseDirname)
    const env = shipit.options.environment
    console.log(shipit.releaseDirname)

    if (env === 'staging') {
      shipit.on('deployed', async() => {
        console.log('\n\n')
        const releaseDir = path.join(shipit.releasesPath, shipit.releaseDirname)
        console.log('\n\n')
        console.log('Listing releases and their permissions')
        console.log('\n')
        await shipit.remote(`ls -al  ${releaseDir}/web/`)
        console.log('\n\n')
        console.log('Building Docker containers')
        console.log('\n')
        // await shipit.remote(`cd /srv/root/current/ && exec /srv/root/current/build_nomad.sh`)
        console.log('\n\n')
        console.log('Nomad deploying')
        console.log('\n')
        await shipit.remote(`cd /srv/root/current/nomad && env RELEASE=${shipit.releaseDirname} envsubst '$RELEASE' < job.hcl > run_job.hcl && exec nomad job run run_job.hcl`)
        //await shipit.remote(`exec nomad status flow-group`)
        console.log('\n\n')
        console.log('Listing all Docker containers')
        console.log('\n')
        await shipit.remote(`docker ps -a`)
      });
    }

    if (env === 'staging_postgres') {
      shipit.on('deployed', async() => {
        console.log('\n\n')
        const releaseDir = path.join(shipit.releasesPath, shipit.releaseDirname)
        console.log('\n\n')
        console.log('Building Docker containers')
        console.log('\n')
        // await shipit.remote(`cd /srv/root/current/ && exec /srv/root/current/build_nomad.sh`)
        console.log('\n\n')
        console.log('Nomad deploying')
        console.log('\n')
        await shipit.remote(`cd /srv/root/current/nomad && env RELEASE=${shipit.releaseDirname} envsubst '$RELEASE' < job_postgres.hcl > run_job_postgres.hcl && exec nomad job run run_job_postgres.hcl`)
        //await shipit.remote(`exec nomad status flow-group`)
        console.log('\n\n')
        console.log('Listing all Docker containers')
        console.log('\n')
        await shipit.remote(`docker ps -a`)
      });
    }

    if (env === 'staging_certbot') {
      shipit.on('deployed', async() => {
        console.log('\n\n')
        const releaseDir = path.join(shipit.releasesPath, shipit.releaseDirname)
        console.log('\n\n')
        console.log('Building Docker containers')
        console.log('\n')
        // await shipit.remote(`cd /srv/root/current/ && exec /srv/root/current/build_nomad.sh`)
        console.log('\n\n')
        console.log('Nomad deploying')
        console.log('\n')
        await shipit.remote(`cd /srv/root/current/nomad && env RELEASE=${shipit.releaseDirname} envsubst '$RELEASE' < job_certbot.hcl > run_job_certbot.hcl && exec nomad job run run_job_certbot.hcl`)
        //await shipit.remote(`exec nomad status flow-group`)
        console.log('\n\n')
        console.log('Listing all Docker containers')
        console.log('\n')
        await shipit.remote(`docker ps -a`)
      });
    }

    if (env === 'production') {
      await shipit.remote(`cd ${releaseDir} && cp /srv/root_prod/api/.env ./api/.env`)
    }

  })
}
