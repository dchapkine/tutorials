# Install ingress and letsencrypt certificates on kubernetes cluster


## Setup your kubeconfig env

To simplify commands, put your kubeconfig in a file and set `KUBECONFIG` env variable to that file location

```
export KUBECONFIG=~/yourkubeconf.yaml
```

## Installing nginx ingress

register official helm repo

```
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
```

install

```
helm install ingress-nginx ingress-nginx/ingress-nginx --namespace ingress-nginx --create-namespace
```

wait for LB to be provisioned

```
kubectl --namespace ingress-nginx get services -o wide -w ingress-nginx-controller
NAME                       TYPE           CLUSTER-IP       EXTERNAL-IP   PORT(S)                      AGE    SELECTOR
ingress-nginx-controller   LoadBalancer   10.20.30.40   <pending>     80:31482/TCP,443:30604/TCP   113s   app.kubernetes.io/component=controller,app.kubernetes.io/instance=ingress-nginx,app.kubernetes.io/name=ingress-nginx



ingress-nginx-controller   LoadBalancer   10.20.30.40   123.124.125.126   80:31482/TCP,443:30604/TCP   2m31s   app.kubernetes.io/component=controller,app.kubernetes.io/instance=ingress-nginx,app.kubernetes.io/name=ingress-nginx

```


## Use ingress

Before we configure https, we can check if ingress is working properly by applying this config

Make sure to replace `__YOUR_APP_DOMAIN__` by your domain

kubectl apply -f nodeingress.yml

```
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ingress-nodetest
  namespace: default
spec:
  ingressClassName: nginx
  rules:
    - host: __YOUR_APP_DOMAIN__
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: nodetest
                port:
                  number: 80
```


## Install cert manager

```
helm repo add jetstack https://charts.jetstack.io
helm repo update
```

```
helm install cert-manager jetstack/cert-manager --namespace cert-manager --create-namespace --version v1.10.0 --set installCRDs=true
```


## Create certificate issuer


Make sure to replace email and change issuer name (cluster-letsencrypt-prd) if needed

Notice that we are using cluster wide issuer (ClusterIssuer), not a namespace wide issuer (Issuer)

You willbe able to reference this issuer from any namespace's ingress config

cert-issuer.yaml

```
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: cluster-letsencrypt-prd
spec:
  acme:
    ## The ACME server URL
    server: https://acme-v02.api.letsencrypt.org/directory
    ## Email address used for ACME registration
    email: YOUREMAIL@DOMAIN.COM
    ## Name of a secret used to store the ACME account private key
    privateKeySecretRef:
      name: cluster-letsencrypt-prd
    ## Enable the HTTP-01 challenge provider
    solvers:
    - http01:
        ingress:
          class: nginx
```

```
kubectl apply -f cert-issuer.yaml
```


```
An Issuer or ClusterIssuer identifies which Certificate Authority cert-manager will use to issue a certificate. Issuer is a namespaced resource allowing you to use different CAs in each namespace, a ClusterIssuer is used to issue certificates in any namespace. Configuration depends on which ACME challenge you are using.
```


## Update ingress to use TLS and cert manager

Make sure to replace `__YOUR_APP_DOMAIN__` by your domain


nodeingress.yaml
```
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  annotations:
    cert-manager.io/cluster-issuer: cluster-letsencrypt-prd
  name: ingress-nodetest
  namespace: default
spec:
  ingressClassName: nginx
  rules:
    - host: __YOUR_APP_DOMAIN__
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: nodetest
                port:
                  number: 80
  tls:
    - hosts:
      - __YOUR_APP_DOMAIN__
      secretName: ingress-nodetest-cert
```

```
kubectl apply -f nodeingress.yaml
```


## Uninstall instructions

uninstall cert manager

```
helm uninstall cert-manager -n cert-manager
kubectl delete ns cert-manager
```

uninstall nginx ingress

```
helm uninstall ingress-nginx --namespace ingress-nginx
kubectl delete ns ingress-nginx
```



## Links

- https://github.com/kubernetes/ingress-nginx
- https://cert-manager.io/docs/usage/ingress/
- https://marketplace.digitalocean.com/apps/nginx-ingress-controller
- https://github.com/digitalocean/Kubernetes-Starter-Kit-Developers



## Tested

Tested on Digital Ocean K8S oct 2022, don't use 1 click apps they are outdated and won't work

