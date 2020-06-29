# https://www.nomadproject.io/docs/job-specification/

job "root_certbot" {

  datacenters = ["dc1"]

  group "root_certbot" {

    # Specify the number of these tasks we want.
    count = 1

    restart {
      attempts = 3
      delay    = "30s"
    }

    update {
      stagger = "10s"
      max_parallel = 1
      canary       = 0
      auto_revert = false
    }

    # Certbot API
    task "certbot_api" {

      driver = "docker"
      env {
        "RELEASE" = "${RELEASE}"
      }
      template {
        data = <<EOH
        SSL_CHECK_STATUS  = {{range service "certbot-api-certificate-file-check"}}{{.Status}}{{end}}
        EOH
        destination   = "${NOMAD_TASK_DIR}/env"
        change_mode   = "noop"
        perms         = "0775"
        env = true
      }
      template {
        data = <<EOH
        API_DOMAIN = "{{key "service/root/api/domain"}}"
        EOH
        destination   = "${NOMAD_TASK_DIR}/domain"
        change_mode   = "restart"
        perms         = "0775"
        env = true
      }
      template {
        data = <<EOH
        #!/bin/sh
        trap exit TERM;
        while :;
        do certbot --cert-name ${API_DOMAIN} \
        --email nedim@clearview.team \
        --agree-tos --no-eff-email certonly \
        --renew-by-default --webroot -w /var/www/certbot/ \
        --preferred-challenges http -d ${API_DOMAIN}; sleep 15h & wait ${!}; done;
        EOH
        destination   = "${NOMAD_TASK_DIR}/entrypoint.sh"
        change_mode   = "noop"
        perms         = "0775"
      }
      config {
        image = "certbot/certbot"
        auth {
          server_address = "hub.docker.com"
        }
        entrypoint = [
        "/bin/sh",
        "-c",
        "ls /var/www/certbot && cat ${NOMAD_TASK_DIR}/entrypoint.sh && exec ${NOMAD_TASK_DIR}/entrypoint.sh"
        ]
        extra_hosts = [
          "host:${attr.unique.network.ip-address}",
          "consul:${attr.unique.network.ip-address}"
        ]
      }
      config {
        volumes = [
          "root_letsencrypt:/etc/letsencrypt",
          "root_certbot:/var/www/certbot"
        ]
        volume_driver = "local"
      }
      service {
        name = "certbot-api-certificate-file-check"
        tags = ["cerbot","root/api"]
        meta {
          domain_name = "${API_DOMAIN}"
        }
        check {
          type     = "script"
          name     = "certbot-api-certificate-file-check"
          command  = "/bin/sh"
          args     = ["-c", "test -f /etc/letsencrypt/live/${API_DOMAIN}/fullchain.pem"]
          interval = "60s"
          timeout  = "5s"
        }
     }
    }
  }
}
