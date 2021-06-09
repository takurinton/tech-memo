---
title: React v18 について
head:
  - - meta
    - name: og:title
      content: 技術メモ | React v18 について
  - - meta
    - name: twitter:title
      content: 技術メモ | React v18 について
  - - meta
    - name: og:description
      content: 技術メモ | React の v18 のプラン（アルファ版）出たっぽいのでまとめる
  - - meta
    - name: twitter:description
      content: 技術メモ | React の v18 のプラン（アルファ版）出たっぽいのでまとめる
  - - meta
    - name: og:image
      content: https://res.cloudinary.com/dtapptgdd/image/upload/w_1000/l_text:Sawarabi Gothic_70_bold:React v18 について/v1620370500/Screen_Shot_2021-05-07_at_15.54.47_extlvu.png
  - - meta
    - name: twitter:image
      content: https://res.cloudinary.com/dtapptgdd/image/upload/w_1000/l_text:Sawarabi Gothic_70_bold:React v18 について/v1620370500/Screen_Shot_2021-05-07_at_15.54.47_extlvu.png

---

# {{ $frontmatter.title }}

React v18 のプランが6月8日に発表された。  
[参考](https://reactjs.org/blog/2021/06/08/the-plan-for-react-18.html)  
  
まだアルファ版ということでメジャーリリースは半年後くらいになりそう？かなと思ってるけど楽しみワクワクワクワクじゃ。  
  
それに向けて React チームはサードパーティのライブラリの作成者のための Alpha 版を公開した。  
また、github 上での [disscussions](https://github.com/reactwg/react-18) も公開されている。  
  
## React v18 で何が変わるのか

[startTransition](https://github.com/reactwg/react-18/discussions/41) という大きな画面の更新中でもアプリのレスポンスを維持するためのAPI（どれくらいの規模を示しているのかはわからない）や、React.lazy のサポートが組み込まれている [新しいストリーミングサーバーレンダラー](https://github.com/reactwg/react-18/discussions/21) が実装されるらしい。  
  
いずれにせよ破壊的な変更ではないため、メジャーリリース後に新しく v18 を導入するとしてもあまり気にすることはなさそう。  
  
これらは同時レンダリングと言われ、React が同時に複数のバージョンの UI を提供することができるようになる。  

## Alpha 版を試したい場合

`@alpha` をつけて npm からインストールをすれば使用することができる。  

ex. )  
`npm install react@alpha react-dom@alpha`  
  
これはレポジトリの最新のコミットを元にしてビルドされている。もし PR がマージされたら次の日には alpha 版が更新されている。  
当然だけどバグが残ったままマージされたり、API が大幅に変わったりする可能性があるのでプロダクション環境での使用はだめ。  
また、RC 環境に関してはベータ版から数週間後に提供が開始されるっぽい。正式リリースは RC からさらに数週間後なのでやはり最初に言ったように半年後くらいかなと思う。

## 面白そうなやつ


#### New Suspense SSR Architecture in React 18

ディスカッションの中に [New Suspense SSR Architecture in React 18](https://github.com/reactwg/react-18/discussions/37) というのがあった。  
要は SSR をするときのアーキテクチャと hydration についての内容だけど、なんか僕の考えてる規模じゃない。  
`pipeToNodeWritabl` なる API を生やそうという話で、`Suspense` の正式リリースを目指してるっぽい。（Suspense は現在実験段階で、v16.6 で導入されている）  
`Suspense` はコードのロードを「待機」して宣言的に loading の状態を指定することができる。（[CodeSandbox](https://codesandbox.io/s/frosty-hermann-bztrp)）  
分割した hydration ができるみたいなイメージ。
  
`Suspense` は データ取得をビューレイヤと密結合させないという特性があり、race condition を避け、ローディング状態の表示の設計を容易にするためのライブラリというような位置づけである。  
上のディスカッションを読めばわかるけど、SSR の設計がすごい深く書いてある。もうエンジニアだけの領域じゃない気がしてきた。UX すげえ。  

#### New feature: startTransition

もう一つ、[New feature: startTransition](https://github.com/reactwg/react-18/discussions/41) というのがあった。  
大画面の更新中でもアプリのレスポンスを維持するのに役立つ API と書いていある。  
特定の更新を `transition` としてマークすることでよりインタラクティブなアプリケーションを作ることができるような感じ。`transition` としてマークってなんだ。  
  
今までの React は優先順位が高かろうが低かろうが VDOM が更新されたら即座に実 DOM を更新するような設計になっていた。  
ただそれだと大規模になればなるほどリソースを食ってしまったり、悪い場合は遅延が発生したりする。  
ただし、今回の変更を加えるとレンダリングのスピードに優先順位をつけられるみたいな感覚。  
例えば、入力フォームがあって、入力結果次第で検索をするようなフィールドがあるとすると、ユーザーの入力内容は即座に更新して欲しいけど検索は多少遅延してもいいみたいなことがある。  
そのような時に優先順位をつけられるみたいな感じ。  

```js
// こっちはタイピングのたびに即座に更新してほしい
setInputValue(input);

// これはあまり速さ求めてない
setSearchQuery(input);
```

このような感じで実装することができるみたい。



## まとめ

React、結構枯れてきてるライブラリで、いろいろな機能がある中でここまで大規模なアプリケーションでのパフォーマンスも考えててすげえってなってる。  
逆にここまできたらそっち方面に舵を切るのは当然っちゃ当然なのか。React あまり詳しくないけど、v18 に関してはディスカッションを追ってみようかなと思った。
