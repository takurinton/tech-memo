---
title: Docker で playwright を導入する際のメモ
head:
  - - meta
    - name: og:title
      content: Docker で playwright を導入する際のメモ
  - - meta
    - name: twitter:title
      content: Docker で playwright を導入する際のメモ
  - - meta
    - name: og:description
      content: playwright が alpine で動作しなかった（するようにもできるっぽいけど）ので debian-slim に乗り換えた、いろいろつまづいたのでメモ。
  - - meta
    - name: twitter:description
      content: playwright が alpine で動作しなかった（するようにもできるっぽいけど）ので debian-slim に乗り換えた、いろいろつまづいたのでメモ。
  - - meta
    - name: og:image
      content: https://res.cloudinary.com/dtapptgdd/image/upload/w_1000/l_text:Sawarabi Gothic_70_bold:playwright 導入時のメモ/v1620370500/Screen_Shot_2021-05-07_at_15.54.47_extlvu.png
  - - meta
    - name: twitter:image
      content: https://res.cloudinary.com/dtapptgdd/image/upload/w_1000/l_text:Sawarabi Gothic_70_bold:playwright 導入時のメモ/v1620370500/Screen_Shot_2021-05-07_at_15.54.47_extlvu.png
---

# {{ $frontmatter.title }}

playwright が alpine で動作しなかった（するようにもできるっぽいけど）ので debian-slim に乗り換えた、いろいろつまづいたのでメモに残す。

## そもそも

そもそも Dockerfile 自分で書いたことないし何からしていいか分からないので情報収集。  

#### alpine とは

#### debian とは

#### slim とは

## headless browser

#### chrome の場合

例えば debian-slim の node コンテナで headless chrome をインストールしようとするとこうなる。

```docker
FROM node:14.15.4-slim

USER root

RUN apt-get update && apt-get install -y \
	apt-transport-https \
	ca-certificates \
	curl \
	gnupg \
	--no-install-recommends \
	&& curl -sSL https://dl.google.com/linux/linux_signing_key.pub | apt-key add - \
	&& echo "deb https://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list \
	&& apt-get update && apt-get install -y \
	google-chrome-stable \
	fontconfig \
	fonts-ipafont-gothic \
	fonts-wqy-zenhei \
	fonts-thai-tlwg \
	fonts-kacst \
	fonts-symbola \
	fonts-noto \
	fonts-freefont-ttf \
	--no-install-recommends \
	&& apt-get purge --auto-remove -y curl gnupg \
	&& rm -rf /var/lib/apt/lists/*
```