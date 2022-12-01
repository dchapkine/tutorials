

# Intro

Using private docker repository on your kubernetes cluster is straight forward, however there is few ways to configure that, let's see.



# Create a registry secret

In any case we will need to store out token in a k8s secret object


```
# example for dockerhub

export DOCKER_SERVER=docker.io
export DOCKER_USERNAME=...
export DOCKER_PASSWORD=...
export DOCKER_EMAIL=...
export USE_NAMESPACE=default

kubectl create secret docker-registry dockerhub-readonly \
	--docker-server="$DOCKER_SERVER" \
	--docker-username="$DOCKER_USERNAME" \
	--docker-password="$DOCKER_PASSWORD" \
	--docker-email="$DOCKER_EMAIL" \
	--namespace="$USE_NAMESPACE"

```

by default it will create the secret in default namespace, if you want to create it inside another namespace, change `$USE_NAMESPACE` variable



# Use secret to pull from private registry 


The way it works is that you have to specify `imagePullSecrets` config in your pod

```
apiVersion: v1
kind: Pod
metadata:
  name: nodetest
spec:
  containers:
  - name: nodetest
    image: docker.io/__ACCOUNT_NAME__/__IMAGE_NAME__:__TAG__
  imagePullSecrets:
  - name: dockerhub-readonly
```

...however, in most use cases nobody wants to set this manually, so we will automate this attribute by allowing the service account of your namespace to append it to any pod existing in that namespace

Make sure you edit the namespace flag to match your own


```
kubectl patch serviceaccount default -p '{"imagePullSecrets": [{"name": "dockerhub-readonly"}]}' --namespace=default
```

Repeat for every namespace you have


# Test it out

If you followed previous totorial you should already have an ingress setup, but as a reminder i include it in the config below:

So we need to create an ingress (or reuse from previous tutorial), a pod from private image and a service

Regarding the private image content, any http server listening on 8080 will do

Make sure to replace all the variables by your own:

- `__YOUR_APP_DOMAIN__` your domain name for this app
- `__ACCOUNT_NAME__` dockerhub account name
- `__IMAGE_NAME__` private dockerhub repository name
- `__TAG__` private dockerhub image tag name

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
    - 
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
---
apiVersion: v1
kind: Pod
metadata:
  name: nodetest
  labels:
    app.kubernetes.io/name: nodetest
spec:
  containers:
  - name: nodetest
    image: docker.io/__ACCOUNT_NAME__/__IMAGE_NAME__:__TAG__
    ports:
    - containerPort: 8080
    readinessProbe:
      tcpSocket:
        port: 8080
      initialDelaySeconds: 5
      periodSeconds: 10
    livenessProbe:
      tcpSocket:
        port: 8080
      initialDelaySeconds: 15
      periodSeconds: 20
---
apiVersion: v1
kind: Service
metadata:
  name: nodetest
spec:
  selector:
    app.kubernetes.io/name: nodetest
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
```

When accessing your ingress url you should see the content returned by your pod




# Links

https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/
https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/#add-imagepullsecrets-to-a-service-account