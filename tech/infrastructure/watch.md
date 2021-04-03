---
title: 挙動がおかしい時にやること
head:
  - - meta
    - name: og:title
      content: 挙動がおかしい時にやること
  - - meta
    - name: twitter:title
      content: 挙動がおかしい時にやること
  - - meta
    - name: og:description
      content: 挙動がおかしい時にやることを随時載せていく
  - - meta
    - name: twitter:description
      content: 挙動がおかしい時にやることを随時載せていく
---

# {{ $frontmatter.title }}

Docker の挙動がおかしかった時の対処法を雑に更新していく

## module が読み込まれない

- `docker-compose up` の際、frontend で `Cannot find module 'vite'` となった
    - `docker-compose down --volumes`
    - 全部落とす的な感じ

## 消したい時

### image を消したい

- `docker images` で現在起動中の image を取得できる
- ```bash
    $ docker images
    REPOSITORY                TAG       IMAGE ID       CREATED          SIZE
    graphql_suburi_frontend   latest    63bbc967d97d   17 minutes ago   995MB
    <none>                    <none>    4b4d7b10a547   17 minutes ago   995MB
    <none>                    <none>    a31564e77316   21 minutes ago   995MB
    <none>                    <none>    7757b0a8a10d   22 minutes ago   995MB
    <none>                    <none>    44e3c01e6bbb   23 minutes ago   995MB
    <none>                    <none>    0196af365966   28 minutes ago   1.03GB
    graphql_suburi_backend    latest    a2954e368b9d   54 minutes ago   615MB
    mariadb                   10.4      fdb24818ad73   5 hours ago      394MB
    flyway/flyway             latest    abe82591ba51   44 hours ago     312MB
    ```
- `docker rmi {IMAGE ID}` で image を削除することができる

### コンテナを消したい

- `docker ps` で現在起動中のコンテナを取得できる
- ```bash
    CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS                      PORTS               NAMES
    f60487285325        hello-world         "/hello"            2 seconds ago       Exited (0) 2 seconds ago                        nostalgic_goldstine
    ```
- `docker rm {CONTAINER ID}` でコンテナを削除することができる
- ```bash
    $ docker rm a403ffe73d31
    a403ffe73d31
    ```

## コンテナの中に入りたい

コンテナの中に直接入って作業がしたい時があると思うけどそれのメモ。  

### コンテナの起動

`-d` オプションをつけて起動する。

`docker-compose up -d`  

```bash
$ docker-compose up -d
Creating backend  ... done
Creating frontend ... done
Creating db       ... done
```

### 動いてるサービスの確認

`docker-compose ps`

```bash
$ docker-compose ps
    Name             Command               State            Ports
-------------------------------------------------------------------------------
backend     reflex -r \.go$ -s -- sh - ...   Up       0.0.0.0:8888->8888/tcp
db          docker-entrypoint.sh mysqld      Up       0.0.0.0:3306->3306/tcp
frontend    docker-entrypoint.sh npm r ...   Up       0.0.0.0:3306->3000/tcp
```

### 中に入る

`docker-compose exec {Service Name} /bin/bash`

今回はバックエンドに入ってみる

```bash
$ docker-compose exec backend /bin/bash
bash-5.1# 
```

ここで操作することができるようになる。  

```bash
bash-5.1# ls
Dockerfile  Makefile    backend     go.mod      go.sum      main.go
bash-5.1#
```

こんな感じ。