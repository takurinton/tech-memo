---
title: Web Components について
head:
  - - meta
    - name: og:title
      content: Web Components について
  - - meta
    - name: twitter:title
      content: Web Components について
  - - meta
    - name: og:description
      content: Web Components についてをめちゃくちゃ簡単にまとめる
  - - meta
    - name: twitter:description
      content: Web Components についてをめちゃくちゃ簡単にまとめる
---

# {{ $frontmatter.title }}

## Web Components とは
> Web Components は、再利用可能なカスタム要素を作成し、ウェブアプリの中で利用するための、一連のテクノロジーです。コードの他の部分から独立した、カプセル化された機能を使って実現します。 

MDN より引用。要はコンポーネントごとに分割して再利用することができるコードにするってことですね。React や Vue などのコンポーネントベースのフレームワークが最近人気ですが、フレームワークを使わなくても Web の標準に乗っかっていい感じに効率の良いコードを書くことができるのはいいことですね。

Web Components のサンプルは [ここ](https://github.com/mdn/web-components-examples) にあります。


Web Components は3つの主要な技術からなり、それらを組み合わせて多目的なカスタム要素を作成します。  
  
- カスタム要素
    - カスタム要素とその動作を定義するための、一連の JavaScript API です。以降、ユーザーインターフェースの中で好きなだけ使用することができます。
- Shadow DOM
    - カプセル化された "Shadow" DOM ツリーを要素に紐付け、関連する機能を制御するための、一連の JavaScript API です。 Shadow DOM ツリーは、メインドキュメントの DOM とは別にレンダリングされます。こうして、要素の機能を公開せずに済み、ドキュメントの他の部分との重複を恐れることなく、スクリプト化やスタイル化できます
- html テンプレート
    - `<template>` と `<slot>` 要素によって、レンダリングされたページ内に表示されないマークアップのテンプレートを書くことができます。カスタム要素の構造体の基礎として、それらを何度も再利用できます。

## Web Components の基本的な流れ

Web Component を実装する基本的な流れはこのような感じになります。

1. Web Component の機能を明示したクラスもしくは関数を作成する
1. `CustomElementRegistry.define()` メソッド に新しく作成したカスタム要素を登録する
1. 必要なら、`Element.attachShadow()` メソッドを使って、Shadow DOM をカスタム要素に紐付ける
1. 必要なら、`<template>` と `<slot>` を使って、html テンプレートを定義する
1. ページ内のお好みの場所で通常の html 要素のように、カスタム要素を使用する

こんな感じです。React や Vue でも同じようなことはしてるはずなので問題なさそうです。

## 実際にやってみる

実際にやってみましょう。  

まずは Web Components を作成します。  
ディレクトリの構成としてはシンプルで、ルートに `index.js` と `index.html` が存在します。  


#### index.js 

ここでは Web Components の定義を行なっています。  
`PopUpInfo` コンポーネントでは `shadow` の定義とスタイリング、そしてアタッチをしています。  


```js
// index.js 
class PopUpInfo extends HTMLElement {
    constructor() {
      super();
  
      // shadow を作成
      const shadow = this.attachShadow({mode: 'open'});
  
      // span を作成する
      const wrapper = document.createElement('span');
      wrapper.setAttribute('class', 'wrapper');
  
      const icon = document.createElement('span');
      icon.setAttribute('class', 'icon');
      icon.setAttribute('tabindex', 0);
  
      const info = document.createElement('span');
      info.setAttribute('class', 'info');
  
      // 属性コンテンツを取得し、情報スパン内に配置します
      const text = this.getAttribute('data-text');
      info.textContent = text;
  
      // icon を入れる
      let imgUrl;
      if(this.hasAttribute('img')) {
        imgUrl = this.getAttribute('img');
      } else {
        imgUrl = 'img/default.png';
      }
  
      const img = document.createElement('img');
      img.src = imgUrl;
      icon.appendChild(img);
  
      // Shadow DOM に適用する CSS を string で作成します
      const style = document.createElement('style');
      console.log(style.isConnected);
  
      style.textContent = `
        .wrapper {
          position: relative;
        }
        .info {
          font-size: 0.8rem;
          width: 200px;
          display: inline-block;
          border: 1px solid black;
          padding: 10px;
          background: white;
          border-radius: 10px;
          opacity: 0;
          transition: 0.6s all;
          position: absolute;
          bottom: 20px;
          left: 10px;
          z-index: 3;
        }
        img {
          width: 1.2rem;
        }
        .icon:hover + .info, .icon:focus + .info {
          opacity: 1;
        }
      `;
  
      // 作成した要素を Shadow DOM にアタッチします
      shadow.appendChild(style);
      console.log(style.isConnected);
      shadow.appendChild(wrapper);
      wrapper.appendChild(icon);
      wrapper.appendChild(info);
    }
  }
  
  // Element を定義します
  customElements.define('popup-info', PopUpInfo);
```


#### index.html 

次に html ファイルに上で作成した `PopUpInfo` コンポーネントを適用します。

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>web components suburi</title>
  </head>
  <body>
    <h1>web components suburi</h1>
    <form>
      <div>
        <label for="cvc">入力してください
            <!-- ここでコンポーネントを使用している -->
            <popup-info img="https://www.takurinton.com/me.jpeg" data-text="文字を入力することができますホゲホゲ"></popup-info>
        </label>
        <input type="text" id="cvc">
      </div>
    </form>
    <script src="./index.js" defer></script>
  </body>
</html>
```

html には上の JS を読み込んでコンポーネントを使用することができます。こりゃ便利だ。  
動き的には `img` で指定した画像にカーソルを当てると `data-text` のテキストが表示されるといったものです。
  
実際にはこんな感じになります。  

![web-components-demo-after](/web-components-demo-befor.png)  
  
カーソルを当てるとこんな感じです。  
![web-components-demo-after](/web-components-demo-after.png)  

良さそう。こんな感じで Web Components を使用することができます。

## カスタムビルトインエレメント

Web Components では既存のタグに `is` 要素をつけて Web Components を渡すこともできます。  
上と同じような構成の JS と html があるとします。

#### index.js

このような形で作成することができます。文字数をカウントしてくれます。

```js
// index.js
class WordCount extends HTMLParagraphElement {
  constructor() {
    super();

    // 文字数をカウントするエレメントを作成
    var wcParent = this.parentNode;

    function countWords(node){
      var text = node.innerText || node.textContent
      return text.split(/\s+/g).length;
    }

    var count = 'Words: ' + countWords(wcParent);

    // Shadow を作成
    var shadow = this.attachShadow({mode: 'open'});

    // テキストノードを作成し、それに単語数を追加します
    var text = document.createElement('span');
    text.textContent = count;

    // Shadow を加える
    shadow.appendChild(text);


    // カウントを更新する処理
    setInterval(function() {
      var count = 'Words: ' + countWords(wcParent);
      text.textContent = count;
    }, 200)

  }
}

// Element を定義します
customElements.define('word-count', WordCount, { extends: 'p' });
```

#### p タグに適用する

```html
<p is="word-count"></p>
```

こんな感じでできました。良さそう。

## ライブラリなどなど

ここら辺がある(らしい)  
触ってみたい。

- Bosonic
    - Web開発者の日々のニーズに応えるコンポーネントのコレクション。
- Polymer
    - カスタム要素の作成するための機能セットを提供している。
- SkateJS
    - Web conponents を記述するための軽量な Javascript ライブラリ。
- X-Tagは
    - コンポーネントの開発者にインターフェイスを提供するオープンソースの Javascript ライブラリ。
- Slim.js
    - ES6のネイティブのクラス継承を利用して、コンポーネントにデータバインディングと拡張機能を提供する軽量なオープンソースの Web components ライブラリ。

## まとめ
まだお触り程度なのでこれから深めていきたいです。  

知ってるものも含めてここらへんのリンクをたどっていきたい。  

- [template](https://developer.mozilla.org/ja/docs/Web/HTML/Element/template)
- [HTML Living Standard](https://html.spec.whatwg.org/multipage/scripting.html#the-template-element)
- [DOM](https://dom.spec.whatwg.org/#shadow-trees)
- [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM)
- [Shadow Root](https://developer.mozilla.org/ja/docs/Web/API/ShadowRoot)
- [DocumentOrShadowRoot](https://developer.mozilla.org/ja/docs/orphaned/Web/API/DocumentOrShadowRoot)
- [Custom Element](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements)
- [HTML Imports](https://developer.mozilla.org/en-US/docs/Web/Web_Components/HTML_Imports)  

また、[GitHub のレポジトリ](https://github.com/mdn/web-components-examples) も漁っていきたい。