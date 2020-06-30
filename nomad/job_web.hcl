# https://www.nomadproject.io/docs/job-specification/

job "root_web" {

  datacenters = ["dc1"]

  group "root-web" {

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

    # Task web
    task "web" {

      driver = "docker"

      config {
      image = "207259804926.dkr.ecr.us-east-1.amazonaws.com/root/web"
      #force_pull = true
      advertise_ipv6_address = false
      hostname = "web"
      #dns_servers = ["1.1.1.1","${attr.unique.network.ip-address}"]
      dns_search_domains = [ "consul" ]
      extra_hosts = [
        "host:${attr.unique.network.ip-address}",
      ]
      port_map {
        web = 80
      }
    }
    env {
      "RELEASE" = "${RELEASE}"
    }
    template {
      data = <<EOH
      #SSL_CHECK_STATUS  = {{range service "certbot-hodor-api-certificate-file-check"}}{{.Status}}{{end}}
      WEB_DOMAIN = "{{key "service/root/web/domain"}}"
      EOH
      destination   = "${NOMAD_TASK_DIR}/web_env"
      change_mode   = "noop"
      perms         = "0775"
      env = true
    }
    template {
      data = <<EOH
      API_IP_FROM_CONSUL={{range service "api"}}{{.Address}}{{end}}

      VUE_APP_API_URL=//{{range service "api"}}{{.Address}}{{end}}:{{range service "api"}}{{.Port}}{{end}}
      VUE_APP_PORT=3000

      EOH
      destination   = "${NOMAD_TASK_DIR}/.env"
      change_mode   = "restart"
      env = true
    }
    resources {
      cpu    = 256
      memory = 512
      network {
        mbits = 1
        port "web" {
          }
        }
      }
    service {
      name = "web"
      port = "web"
      tags = ["root","web"]
      meta {
        domain_name = "${WEB_DOMAIN}"
      }
      address_mode = "host"
      check {
        name     = "host-web-check"
        type     = "http"
        path     = "/"
        interval = "10s"
        timeout  = "20s"
        address_mode = "host"
      }
    }
    }
  }
}
