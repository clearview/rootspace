#!/bin/bash
echo "starting entry script"
chmod +x /local/bin/consul-template
exec /local/bin/consul-template \
     -template="/proxy/api.ctmpl:/etc/nginx/conf.d/api.conf" \
     -template="/proxy/api.ctmpl:/local/api.conf" \
     -template="/proxy/web.ctmpl:/etc/nginx/conf.d/web.conf" \
     -template="/proxy/web.ctmpl:/local/web.conf" \
     -consul-addr "consul:8500" \
     -log-level debug \
     -exec "$@"
