variable "TAG" {
  default = "latest"
}

group "default" {
  targets = ["api", "web"]
}

target "api" {
  context    = "./api"
  dockerfile = "Dockerfile"
  tags = ["docker.io/rootspace/api:${TAG}"]
  platforms = ["linux/amd64", "linux/arm64"]
}

target "web" {
  context    = "./web"
  dockerfile = "Dockerfile"
  tags = ["docker.io/rootspace/web:${TAG}"]
  platforms = ["linux/amd64", "linux/arm64"]
}

# Local build

group "local" {
  targets = ["root_api", "root_web"]
}

target "root_api" {
  context    = "./api"
  dockerfile = "Dockerfile"
  tags = ["root_api"]
}

target "root_web" {
  context    = "./web"
  dockerfile = "Dockerfile"
  tags = ["root_web"]
}
