---
title: urql のキャッシュについて
head:
  - - meta
    - name: og:title
      content: 技術メモ | urql のキャッシュについて
  - - meta
    - name: twitter:title
      content: 技術メモ | urql のキャッシュについて
  - - meta
    - name: og:description
      content: 技術メモ | urql のキャッシュについての理解が足りていないのでメモ
  - - meta
    - name: twitter:description
      content: 技術メモ | urql のキャッシュについての理解が足りていないのでメモ
  - - meta
    - name: og:image
      content: https://res.cloudinary.com/dtapptgdd/image/upload/w_1000/l_text:Sawarabi Gothic_70_bold:urql のキャッシュについて/v1620370500/Screen_Shot_2021-05-07_at_15.54.47_extlvu.png
  - - meta
    - name: twitter:image
      content: https://res.cloudinary.com/dtapptgdd/image/upload/w_1000/l_text:Sawarabi Gothic_70_bold:urql のキャッシュについて/v1620370500/Screen_Shot_2021-05-07_at_15.54.47_extlvu.png
---

# {{ $frontmatter.title }}

urql のキャッシュについての理解を深めるシリーズ、結局は実装して学びたいから [gqlinton](https://github.com/takurinton/gqlinton) とかいうの生やしてるんだけど、まあそれ以前に前提の知識が足りないよね的な感じでメモ。マジでブログではないオープンな殴り書きスペース有能。    
というかこれはドキュメントを翻訳しただけのメモになりそう。
  
  
urql はキャッシュを operation という単位で保持していて、それは詳細に設定可能、その設定を司るのが Exchange という感じだった。  
それをもう少し掘ってみる。さっきも言ったけど最終的には実装してみて理解する。  
  
## Document Caching について

urql では document caching という手法を使ってキャッシュを行なっている。  
Exchange の前にこれを知っていないといけないので簡単に書く。  

n回目になるけど、urql は operation という単位でキャッシュを保持している。  
operation は以下のような構成になっている。名前がついてるだけで普通と同じ、クエリと引数がある。  
（というか他を知らないからどうなってるのかわからない）

それぞれの

- stringify( query )
    - DocumentNodes は names を使用してキャッシュに入れる
- stableStringify( variables )
    - オブジェクトのプロパティはソートされる必要がある
    - ソートの実装がどこかにあった記憶（ざっとコードリーディングした感じ）

```js
hash (
    stringify( query ) +
    stableStringify( variables )
)
```

レスポンスがここに入ると無期限でキャッシュに値が入る。  
同じクエリ、同じ引数だった場合、2回目以降のリクエストはキャッシュに値が保存されているためリクエストは投げられず、そのデータを直接返す、これがデフォルト設定の cache-first。  
しかし、一部のデータが古くなっていることがわかっている場合はキャッシュされた結果を無効にしてリクエストが再度送信される必要がある。cache-first は更新が少ないページでは優位に働くが必ずしもそれがベストプラクティスではないことを表している。  
document caching では、キャッシュに残ってるクエリに対してのミューテーションを実行した時、値が更新されると仮定して現在のクエリのキャッシュを無効化する。  
クエリとミューテーションの紐付けは `__typename` をクエリのセットに追加することで追加の型情報を保存することができる。  

つまり、ブログの投稿があって、それに対していいねをするようなミューテーションがあったとき、`__typename` を同じにしておけばその記事がいいねされたときにキャッシュをクリアしてくれる。  
  

ただ、これはレスポンスが空の場合、キャッシュは `__typename` を認識できずにそれが無効になる。  
これを修正するには `additionalTypename` を使用するか、正規化されたキャッシュを使用するかの二択になる。

#### additionalTypename ってなんだよ

例えばこんなのがある。

```js
const query = `query { todos { id name } }`; // リクエスト
const result = { todos: [] }; // レスポンス
```

この時点ではクエリが使用できる type がわからない、ここで登場するのが additionalTypename。

```js
const context = useMemo(() => ({ additionalTypenames: ['Todo'] }), []); // typename を明示的に追加
const [result] = useQuery({ query, context }); // これでクエリを実行する
```
  
これでキャッシュはクエリを無効化するタイミング（デフォルトだとミューテーションが飛んだ時）を認識してくれるようになる。  

正規化に関しては [Normalized Caching](./graphcache#normalized-caching) で説明する。
<!-- ## core package 

[コアパッケージ]([core](https://formidable.com/open-source/urql/docs/basics/core/) についても理解しておく必要がある。ちなみに gqlinton では主にコアの実装を行なっている、ここは参考になりそう。   -->


## アーキテクチャについて

[Architeture](https://formidable.com/open-source/urql/docs/architecture/) で設計が述べられている。  
urql では以下の3つを単純化することに重きを置いて設計されている。  

- クエリとミューテーションを送信し、宣言的にレスポンスを受け取る
- キャッシュと状態管理を内部的に抽象化して表現している
- API のエントリポイントを提供する

使ってればわかるけど、結構やりやすい、特に個人的にはキャッシュと状態管理にありがたみを感じてる。作りたいと思ったのもここのライフサイクルが知りたかったから。  
それぞれのアーキテクチャについてドキュメントで説明されてるから自分なりに紐解いてメモとして残す。n回目だけど最終的には実装して理解する。  

#### リクエストと operation

リクエストとその操作に関しては一連の流れがあり、それを GraphQL ライブラリはそれを助けてくれる。  
まず、クエリが発行され、リクエストはクエリと変数に抽象化できる。さらに、リクエストはオブジェクト単位で扱われ、レスポンスは一意に識別されキャッシュされる。  
キャッシュ時に刃キーが発行され、このキーはクエリと変数のハッシュである。  
  
urql のバインディングは、クライアントと直接やりとりを行い、その上にある薄い抽象化である。  
つまり、一部のメソッドは直接クライアントから呼ぶことができる。  
  
urql では、クエリやミューテーションが operation という単位で管理されている。  
operation は、クエリ、変数、オプションだけではなく、全てのプロパティなどを一意に識別して管理します。  
また、操作のメタデータを運ぶ `operation.context` でクライアントのオプションを見つけることができる。
  
  
例えば、`useQuery` と `Client` がいるとき、クライアントは results を送信し、useQuery は operation を介してデータを操作するといった具合である。  
で、これのポイントが各操作がリクエストの開始のシグナルであり、その時点で最終的にコールバックで results を受け取ることが期待できるってこと。  
逆に results が不要になるとそれもシグナルとして扱われてクライアントに送られる。この処理が Exchange。  

#### クライアントと Exchange

core にあるデフォルトのクライアントの Exchange は以下のように定義されてるらしい。  
（こいつらコードの中で登場してたなって顔してる）  

- dedupExchange 
    - 保留中の operation を重複させる
- cacheExchange
    - document caching のロジックと同じ
- fetchExchange
    - fetch を使用してリクエストを投げて、レスポンスを stream に保存する

オプションを指定しない限りデフォルトでこれらが渡される。  
また、以下の Exchange も使用することができる。  

- errorExchange
    - エラーが発生した時にグローバルにコールバック関数を呼び出すことができる
- ssrEchange
    - サーバ側がクライアント側の結果を取得し rehydration することができる
- retryExchange
    - operation の再試行を行うことができる
- multipleExchange
    - マルチパートファイルのアップロードを可能にする
- oersisterFetchExchange
    - 自動永続のクエリのサポートの提供
- authExchange
    - 複雑な認証フローの実装のサポート
- requestPolicyExchange
    - 指定された時間が経過すると `cache-only` の操作と `cache-first` の操作が自動的に `cache-and-network` に切り替えられ再リクエストを行うことができる
- refocusExchange
    - クエリを追跡して window がフォーカスしたときに再リクエストを行う
- devtoolsExchange
    - [urql-devtools](https://github.com/FormidableLabs/urql-devtools) の提供

Exchange の詳しい使い方は [Auther Guide](https://formidable.com/open-source/urql/docs/advanced/authoring-exchanges/) にある。


#### stream の扱い

散々出てきたけど、stream とはなんなのか、
一般的に、stream を扱うことを抽象化と呼ぶらしい（？）  
これによって非同期のプログラムを書くことができる。  
JS の Context 内でいい感じにやることを想定してる。設計の話に聞こえるけど、これはどうやら Promise と Array（オブジェクト？）について話をしてるらしい。  
ここ理解するためには [Observable](https://github.com/tc39/proposal-observable) と [Reactive Programming with Observables](http://reactivex.io/documentation/observable.html) についての理解が必要になりそう。あとで読んで別記事にする。  
  

<!-- ## Normalized Caching 



## Local Resolvers


## Cache Updates


## Schema Awareness


## Offline Supports


## Errors -->



## まとめ

簡単にまとめたけどまあそこそこ全体像は見えた気がする。  
ただ、まだ Graphcache の全体像は残っている。ここら辺も追ってインプットして行けたらいいなと思う。  
GraphQL って何が嬉しいんですかって質問に対して答えられるくらいには理解しないとこれ作れないと思うから頑張って行きたいな。