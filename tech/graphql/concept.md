---
title: GraphQL に入門した（概念）
head:
  - - meta
    - name: og:title
      content: GraphQL に入門した（概念）
  - - meta
    - name: twitter:title
      content: GraphQL に入門した（概念）
  - - meta
    - name: og:description
      content: GraphQL に入門しました。考え方や基本のお作法についてまとめています。
  - - meta
    - name: twitter:description
      content: GraphQL に入門しました。考え方や基本のお作法についてまとめています。
---

# {{ $frontmatter.title }}

## はじめに
GraphQL に入門したのでまとめます。  
ここでは Query と Mutation については触れますが Subscription については触れません。（これで入門したとか言うな）  
一応 Subscription については後日追記予定です。  
手を動かした時間で言うと10時間もないのでそこまで深くやっているわけではありません。  
一旦ここにまとめてから深めて行きたいなと思っています。


## 勉強するときに参考にしたサイトなど

概念のお勉強は書籍を使った方がいいと思ってる人間なのですが、今回はネット上のものだけを拾いながら勉強しました（辛い）  
参考にしたサイトはいかです。あとは手を動かして頑張りました。  

- [GraphQLに入門する - Qiita](https://qiita.com/jintz/items/c9105dca1725224d36a8)
- [GraphQL入門 - Zenn](https://zenn.dev/yoshii0110/articles/2233e32d276551)
- [graphql-go/graphql](https://github.com/graphql-go/graphql)
    - [expamles](https://github.com/graphql-go/graphql/tree/master/examples)
  
ここら辺を参考にしました。  
最初は何言ってるかわからなかったのでちょこちょこ行ったり来たりしながらやりました。辛かった〜〜。  


## 基本的なところ
まず導入としてここがよくわかりませんでした。  
GraphQL にはどうやら `Query` と `Mutation` というものがあるということで何してるかわからなかったです。ここに一番時間使った気がします。  

- 共通の考え方
    - 基本的には POST リクエストの body に情報を持たせることが多いらしい
    - GET のクエリパラメータとして情報を持たせることもできる
    - GraphQL を使って仕事をしたことはないけど GET を使う時は URL をキャッシュしたかったりする時かなとか思ってる(誰か教えてください)
- Query
    - 情報を取得する際に使用する
- Mutation
    - 情報を送る際に取得する

こんな感じです。  
基本的にはこれだけでいいと思います。あとはやって覚えたほうが早い気がする。  
  
## リクエストを送る形式について

次にリクエストを送る形式についてを説明します。  
GraphQL は REST とはだいぶ異なる形でリクエストを送ります。  

形式は以下のような形になっています。  

```query
{ query { posts { id title content } } }
```


## REST との違い
