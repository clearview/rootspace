helm repo add jetstack https://charts.jetstack.io
helm repo update
helm search repo jetstack/cert-manager
helm upgrade --install cert-manager jetstack/cert-manager --namespace cert-manager #--version v0.16.1
helm status cert-manager
