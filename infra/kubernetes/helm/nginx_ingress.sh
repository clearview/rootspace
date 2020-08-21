helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo add stable https://kubernetes-charts.storage.googleapis.com/
helm repo update
helm upgrade --install nginx-ingress ingress-nginx/ingress-nginx --namespace kube-system
