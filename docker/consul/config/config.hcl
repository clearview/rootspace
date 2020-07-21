data_dir = "/consul/data"

log_level = "DEBUG"

datacenter = "dc1"

server = true

bootstrap_expect = 1
ui = true

bind_addr = "0.0.0.0"
client_addr = "0.0.0.0"

ports {
  grpc = 8502
}

connect {
  enabled = true
}

// advertise_addr = "10.5.0.2"
enable_central_service_config = true
