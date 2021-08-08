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

~~playwright が alpine で動作しなかった（するようにもできるっぽいけど）ので debian-slim に乗り換えた、いろいろつまづいたのでメモに残す。~~  
乗り換えられなかった、というより公式が対応してないところに無知の人間が乗り込むより、型にはまる形で環境構築をした方がセキュアかつコスト低くできるのでそっちを選んだ。

## そもそも

そもそも Dockerfile 自分で書いたことないし何からしていいか分からないので情報収集。  

#### alpine とは

Alpine Linux は、musl と BusyBox をベースとした Linux のディストリビューションで、セキュリティやシンプルさ、リソース効率にフォーカスされていて、必要最低限の機能だけで構成されている。  
メジャーな OS との比較だと　

- CentOS 約4GB
- Ubuntu 約700MB
- Alpine 約100MB

のようになっている。  
そのため、機能が足りなかったりすることもあるが、意外と行けちゃうことも多い（らしい）。  
今回は機能が足りなかったパターンで、playwrgiht は（というかモダンブラウザが）alpine に対応してなかったので動かなかった。  
何が足りなかったのかは後から調査するけど、xwindow system 当たりなのではないかと思っている。  
また、通常の `apt install package_name` のコマンドはなく、`apk add package_name` という形でパッケージやライブラリをインストールする。  


#### debian とは
LinuxディストリビューションのひとつであるDebian GNU/Linuxを中心とするUnix系システムのディストリビューションを作成しているプロジェクトで、alpine よりもサポートがしっかりしてる。（alpine は本当に最低限といった感じなので）  
大体のことができてしまうので良さそう。

#### slim とは
docker-slimはコンテナの最適化ツールといった感じ。オープンソースとして運用されていて、実装は Go でされてる。  
これを使うとコンテナを最適化してくれたり、容量をダイエットすることができる手助けをしてくれる。  
Ubuntu や debian の slim もあるのでいい感じに活用できそう。今回は使ってない。

## headless browser

#### chrome の場合

例えば debian-slim の node コンテナで headless chrome をインストールしようとするとこうなる。
chrome の本体に加えて、フォントをインストールしないと日本語を表示することができないのでそこらへんを入れてる。  
これは debian や alpine でオレオレでインストールするための方法なので公式で正規にサポートをしてるわけではない。やるなら自己責任。  
ただ、これで普通にできるので chrome だけでいい人はやれば良さそう。僕は firefox と webkit も欲しかったのでやらなかった。

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

#### firefox の場合

普通に firefox をインストールしようと思ったけどできなかった。  
エラーが出る、どうやら glibc がおかしい。ログは後でメモする。

#### webkit の場合

## 結局やめた

debian や alpine は playwright 公式で対応してないっぽかったのでやめた。  
Ubuntu で対応していくことにした。  
こういう E2E テストをしたり、非同期で動いたりするものは完全に切り離すことに意味があって、依存関係をなくしていきたいのでそこらへんを意識した上で分離した。  
