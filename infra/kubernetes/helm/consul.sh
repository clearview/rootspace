helm repo add hashicorp https://helm.releases.hashicorp.com
helm search repo hashicorp/consul
helm upgrade --install consul hashicorp/consul --set global.name=consul -f config.consul.yaml
helm status consul
# helm get all consul
# helm del --purge consul
