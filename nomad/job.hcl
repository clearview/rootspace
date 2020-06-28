# https://www.nomadproject.io/docs/job-specification/

job "root_api_web" {

  datacenters = ["dc1"]

  group "root-api-group" {

    count = 1

    restart {
      attempts = 3
      delay    = "30s"
    }

    update {
      # Stagger updates every 10 seconds
      stagger = "10s"

      # Update a single task at a time
      max_parallel     = 2
      health_check     = "checks"
      min_healthy_time = "10s"
      healthy_deadline = "5m"
      # Specifies if the job should auto-promote to the canary version when
      # all canaries become healthy during a deployment.
      auto_promote    = true
      # Enable automatically reverting to the last stable job on a failed
      # deployment.
      auto_revert     = true
      canary          = 1
    }


    # API Task
    task "api" {

      driver = "docker"

      config {
        image = "207259804926.dkr.ecr.us-east-1.amazonaws.com/root/api:latest"
        advertise_ipv6_address = false
        hostname = "api"
        dns_search_domains = [ "consul" ]
        extra_hosts = [
          "host:${attr.unique.network.ip-address}",
          // "redis:${REDIS_IP_FROM_CONSUL}",
          // "mongodb:${MONGO_IP_FROM_CONSUL}"
        ]
        port_map {
          api = 3001
        }
      }
      env {
        "RELEASE" = "${RELEASE}"
      }
      template {
        data = <<EOH
        #SSL_CHECK_STATUS  = {{range service "certbot-api-certificate-file-check"}}{{.Status}}{{end}}
        API_DOMAIN = "{{key "service/root/api/domain"}}"
        EOH
        destination   = "${NOMAD_TASK_DIR}/env"
        change_mode   = "noop"
        perms         = "0775"
        env = true
      }
      template {
        data = <<EOH
        POSTGRES_USER = "{{key "service/postgres/credentials/user"}}"
        POSTGRES_PASSWORD = "{{key "service/postgres/credentials/password"}}"
        POSTGRES_DB = "{{key "service/postgres/credentials/db"}}"
        EOH
        destination   = "${NOMAD_TASK_DIR}/.postgres_env"
        change_mode   = "noop"
        perms         = "0775"
        env = true
      }
      template {
        data = <<EOH
        NODE_ENV=development

        PORT=3001
        BASE_URL=http://api:3001

        POSTGRES_HOST={{range service "postgres"}}{{.Address}}{{end}}
        POSTGRES_USER=${POSTGRES_USER}
        POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
        POSTGRES_DB=${POSTGRES_PASSWORD}

        LOG_LEVEL="{{key "service/root/api/log-level"}}"
        API_KEY="{{key "service/root/api/api-key"}}"
        EOH
        # destination   = "${NOMAD_SECRETS_DIR}/ENV"
        destination   = "${NOMAD_TASK_DIR}/.env"
        change_mode   = "restart"
        env = true
      }
      resources {
        cpu    = 200
        memory = 1024
        network {
          mbits = 1
          port "api" {
          }
        }
      }
      service {
        name = "api"
        port = "api"
        tags = ["root","api"]
        meta {
          domain_name = "${API_DOMAIN}"
        }
        address_mode = "host"
        check {
          name     = "host-api-check"
          type     = "http"
          path     = "/"
          interval = "10s"
          timeout  = "2s"
          address_mode = "host"
        }
     }
    }

  }
}
