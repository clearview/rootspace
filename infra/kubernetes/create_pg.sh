#!/bin/bash
# Postgres
kubectl apply -f postgres-configmap.yaml
kubectl apply -f postgres-storage.yaml
kubectl apply -f postgres-deployment.yaml
kubectl apply -f postgres-service.yaml
