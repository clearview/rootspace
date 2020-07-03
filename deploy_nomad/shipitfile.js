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
        message: 'root app deployed',
        triggerEvent: 'deployed'
      }
    },
    staging_api: {
      deployTo: '/srv/root',
      servers: 'rut@server.root.prod.clearviewdev.io',
      branch: 'master'
    },
    staging_web: {
      deployTo: '/srv/root',
      servers: 'rut@server.root.prod.clearviewdev.io',
      branch: 'master'
    },
    staging_postgres: {
      deployTo: '/srv/root',
      verboseSSHLevel: 0,
      servers: 'rut@server.root.prod.clearviewdev.io',
      branch: 'develop'
    },
    staging_proxy: {
      deployTo: '/srv/root',
      verboseSSHLevel: 0,
      servers: 'rut@server.root.prod.clearviewdev.io',
      branch: 'develop'
    },
    staging_certbot: {
      deployTo: '/srv/root',
      verboseSSHLevel: 0,
      servers: 'rut@server.root.prod.clearviewdev.io',
      branch: 'develop'
    },
    production: {
      deployTo: '/srv/root',
      servers: 'rut@api.root.production.clearviewdev.io',
      branch: 'master'
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

    if (env === 'staging_api') {
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
        await shipit.remote(`cd /srv/root/current/nomad && env RELEASE=${shipit.releaseDirname} envsubst '$RELEASE' < job_api.hcl > run_job_api.hcl && exec nomad job run run_job_api.hcl`)
        //await shipit.remote(`exec nomad status flow-group`)
        console.log('\n\n')
        console.log('Listing all Docker containers')
        console.log('\n')
        await shipit.remote(`docker ps -a`)
      });
    }

    if (env === 'staging_web') {
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
        await shipit.remote(`cd /srv/root/current/nomad && env RELEASE=${shipit.releaseDirname} envsubst '$RELEASE' < job_web.hcl > run_job_web.hcl && exec nomad job run run_job_web.hcl`)
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

    if (env === 'staging_proxy') {
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
        await shipit.remote(`cd /srv/root/current/nomad && env RELEASE=${shipit.releaseDirname} envsubst '$RELEASE' < job_proxy.hcl > run_job_proxy.hcl && exec nomad job run run_job_proxy.hcl`)
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
      await shipit.remote(`cd ${releaseDir} && cp /srv/root_prod/web/.env ./web/.env`)
    }

  })
}
