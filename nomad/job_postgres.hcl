# https://www.nomadproject.io/docs/job-specification/

job "root_pg" {

  datacenters = ["dc1"]
  group "root_proxy" {

    # Specify the number of these tasks we want.
    count = 1

    restart {
      attempts = 3
      delay    = "30s"
    }

    # Configure the job to do rolling updates
    update {
      # Stagger updates every 10 seconds
      stagger = "10s"

      # Update a single task at a time
      max_parallel = 1
      health_check = "checks"
      min_healthy_time = "30s"
      healthy_deadline = "9m"
      canary       = 0
      # Enable automatically reverting to the last stable job on a failed
      # deployment.
      auto_revert = true
    }

    # Proxy
    task "proxy" {

      driver = "docker"

      config {
        image = "207259804926.dkr.ecr.us-east-1.amazonaws.com/root/proxy:latest"
        advertise_ipv6_address = false
        hostname = "proxy"
        dns_search_domains = [ "consul" ]
        extra_hosts = [
          "host:${attr.unique.network.ip-address}",
          "consul:${attr.unique.network.ip-address}"
          #"redis:${NOMAD_IP_redis_redis}",
          #"mongodb:${NOMAD_IP_mongodb_mongodb}"
        ]
        command = "nginx -g 'daemon off;'"
        entrypoint = ["/proxy/entrypoint.sh"]
        port_map {
          http  = 80
          https = 443
        }
      }
      artifact {
        source      = "https://releases.hashicorp.com/consul-template/0.25.0/consul-template_0.25.0_linux_amd64.tgz"
        destination = "local/bin/consul-template"
        mode = "file"
      }
      lifecycle {
         hook    = "prestart"
         sidecar = true
      }
      env {
        "RELEASE" = "${RELEASE}"
        version = "${RELEASE}"
      }
      config {
        volumes = [
          "root_letsencrypt:/etc/letsencrypt",
          #"root_proxy:/etc/nginx"
          "root_certbot:/var/www/certbot"
        ]
        volume_driver = "local"
      }
      resources {
        #cpu    = 500
        #memory = 1024
        network {
          mbits = 1
          port "http" {
            static = "80"
          }
          port "https" {
            static = "443"
          }
        }
      }
      service {
        name = "proxy"
        tags = ["root","proxy","nginx"]
        port = "http"
        address_mode = "host"
        check {
          name     = "host-proxy-check"
          type     = "http"
          path     = "/"
          interval = "10s"
          timeout  = "2s"
          address_mode = "host"
        }
     }
    }

  }
  group "root_postgres" {

    # Specify the number of these tasks we want.
    count = 1

    restart {
      attempts = 3
      delay    = "30s"
    }

    # Configure the job to do rolling updates
    update {
      # Stagger updates every 10 seconds
      stagger = "10s"

      # Update a single task at a time
      max_parallel = 1
      health_check = "checks"
      min_healthy_time = "30s"
      healthy_deadline = "9m"
      canary       = 0
      # Enable automatically reverting to the last stable job on a failed
      # deployment.
      auto_revert = true
    }

    # postgres Task
    task "postgres" {

      driver = "docker"

      config {
        image = "postgres:12"
        advertise_ipv6_address = false
        hostname = "postgres"
        auth {
          server_address = "hub.docker.com"
        }
        port_map {
          postgres = 5432
        }
      }
      lifecycle {
         hook    = "prestart"
         sidecar = true
      }
      env {
        "RELEASE"         = "${RELEASE}"
        POSTGRES_USER     = "${POSTGRES_USER}"
        POSTGRES_PASSWORD = "${POSTGRES_PASSWORD}"
        POSTGRES_DB       = "${POSTGRES_DB}"
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
      config {
        volumes = [
          "root_postgres_data:/var/lib/postgresql/data"
        ]
        volume_driver = "local"
      }
      resources {
        #cpu    = 500
        #memory = 1024
        network {
          mbits = 1
          port "postgres" {
            static = "5432"
          }
        }
      }
      service {
        name = "postgres"
        tags = ["root","postgres"]
        port = "postgres"
        address_mode = "host"
        check {
          name     = "host-postgres-check"
          type     = "tcp"
          interval = "10s"
          timeout  = "2s"
          address_mode = "host"
        }
     }
    }
  }
}
