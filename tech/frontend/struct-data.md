---
title: 構造化データについて
head:
  - - meta
    - name: og:title
      content: 構造化データについて
  - - meta
    - name: twitter:title
      content: 構造化データについて
  - - meta
    - name: og:description
      content: 構造化データの規格とその仕組みについて
  - - meta
    - name: twitter:description
      content: 構造化データの規格とその仕組みについて
---

# {{ $frontmatter.title }}

## 構造化データとは何か

構造化データは Google 先生に媚を売るためのものです。色目を使っていきましょう。  
構造化データの記述方法ですが、schema.org にある「ボキャブラリ」と呼ばれる構造化データ用のタグを利用します。
構造化データの種類は JSON-LD や microdata がありますが、先生が推奨してるのは JSON-LD のようです。
通常のマークアップと構造化データを使用したマークアップは以下の違いがあります。  　

### 通常のマークアップ

通常のという表現が正しいかはわかりませんが、構造化マークアップではない例ということで。  
要は何もない、普通のやつです。  

```html
<div>
    <h1>たくりんとんのポートフォリオ</h1>
</div>
```

### 構造化データを使用したマークアップ

上の通常版と比較して構造化してあるとそれぞれのテキストに意味を持たせることができます。  
例としては以下のような感じ。これは microdata の例。  

```html
<div itemscope itemtype="https://schema.org/Thing">
    <h1 itemprop="name">たくりんとんのポートフォリオ</h1>
</div>
```

### つまり

こんな感じでテキストやタグに意味をつけることができます。こうすることで Google 先生の心を撃ち抜く作戦です。おそらく先生はすでにあなたのマークアップにメロメロなので何もしなくても寄ってきてくれます。  
サイトの SEO 対策は今の時代めちゃくちゃ大事なのでできるだけ媚びていきましょう！

### 構造化データの仕組み

[Google 検索セントラル](https://developers.google.com/search/docs/guides/intro-structured-data?hl=ja) の構造化データの部分に詳しく書いてあります。  

> Google 検索では、ページのコンテンツを理解するための取り組みを日々続けています。ページの意図を伝える明示的な手がかりとして構造化データを提供してもらうと、Google はそのページをより正確に理解できるようになります。

このように書いてある通り、上のようにタグやテキストに意味を持たせることで適切にページを表示してくれるようになります。

### パンくずリスト

[Google 検索セントラル](https://developers.google.com/search/docs/data-types/breadcrumb?hl=ja) のパンくずリストの部分に詳しく書いてあります。

> ページに表示されるパンくずリストは、そのページがサイト階層内のどこに位置するかを示しており、ユーザーはサイトを効果的に理解し、移動できます。ユーザーは、パンくずリスト内の最後のパンくずから順番にさかのぼることで、サイトの階層内を 1 レベルずつ上に移動できます。

例えばブログでカテゴリ検索をする場合、  

`ホーム => 投稿一覧 => カテゴリ => 投稿`  

のような形でツリー構造になっています。これをツリー構造を理解してどの位置にいるかを示す方法がパンくずリストです。これもまたサイトを適切に理解するための技術です。  
scheme.org にも [パンくずリスト](http://schema.org/BreadcrumbList) についての記載があります。


## schema.org とは
[これ](https://schema.org/) です。

::: tip
schema.orgとは、Google、Yahoo、Microsoftの3社で策定を進めていた構造化マークアップ（形式言語）規格です。schema.orgの仕様通りにHTMLにマークアップすることで、通常のHTMLマークアップでは伝えきれない、より詳しい正確な情報を検索エンジンのクローラーが認識できるようになることでトラフィック獲得に有利に働きます。
:::


## 構造化データの使用

構造化データのフォーマットは大きく2つに分類されます。

- Microdata
  - html にメタデータを直接記述する
  - タグの中に書くのであまり好きじゃない（個人的）
  - head タグ要素以外の場所でも、meta や link 要素を使って記述できる
  - itemscope、itemtype、itemprop が w3c の提唱するマークアップに含まれる
- JSON-LD
  - ページの見出しまたは本文の script タグ内に埋め込まれる JavaScript 表記
  - Google 先生が推奨してる書き方

大きな違いは html に書き込むか JS を使って記述するかの違いかですね。  
Google は JSON-LD に対して以下のように言っています。

> このマークアップはユーザーに表示するテキストをそのまま挿入しないため、ネストされたデータアイテム（Event の MusicVenue の PostalAddress の Country など）を簡単に表現できます。ここら辺が推奨されてる理由でしょうか。

おそらくここらへんが推奨されてる理由なのではないかなと思っています。
  
  
逆に [schema.org の方では microdata がメインとしてサポートされていた](https://schema.org/docs/faq.html#14) みたいです。

それぞれの書き方を見ていきたいと思います。  

### JSON-LD

JSON-LD では JSON を使用してデータを扱います。  
項目との役割は以下のような形になります。


| 項目 | 説明 |
|:---------------|:---------------|:---------------|
name | パンくずの名前
position | 	パンくずリストの階層を整数で指定
item | 	パンくずのリンク先


html の script タグの中に直接記述していきます。
以下はパンくずリストの JSON-LD です。  

```html
<script type="application/ld+json">{
{
	"@context": "http://schema.org",
	"@type": "BreadcrumbList",
	"itemListElement": [{
		"@type": "ListItem",
		"position": 1,
		"item": {
			"@id": "https://www.takurinton.com/",
			"name": "たくりんとん"
		}
    },
    {
		"@type": "ListItem",
		"position": 2,
		"item": {
			"@id": "https://www.takurinton.com/me/",
			"name": "僕について | たくりんとん"
		}
    }]
}</script>
```

このような形で JSON の形式でパンくずリストを表現することができます。  
もう1パターンくらいやっておくと、普通のサイトの JSON-LD を書いてみます。  

```html
<script type="application/ld+json">
{
    "@context":"http://schema.org",
    "@type":"website",
    "name":"たくりんとん",
    "inLanguage":"jp",
    "publisher": {
    "@type": "Organization",
    "name": "たくりんとん",
    "logo": {
        "@type": "ImageObject",
        "url": "https://www.takurinton.com/me.jpeg"
    }},
    "copyrightYear":"2021-03-28T20:50:37+0000",
    "headline":"たくりんとん",
    "description":"たくりんとんのポートフォリオです",
    "url":"https://www.takurinton.com/"
}
</script>
```

このような形で書くことができます。  
これらを持っておくことでページに意味を持たせることができます。上でも書きましたがこれは外部ファイルとして分離することはできませんので注意してください。

### Microdata

microdata は html にメタデータを直接記述します。  
要素ごとの対応表は以下のような形式になります。

| 対象 | 	追加する属性 | 代表例 |
|:---------------|:---------------|:---------------|
パンくずリスト全体 | itemscope itemtype=”https://schema.org/BreadcrumbList” | ul タグ
各パンくず | itemprop=”itemListElement”, itemscope, itemtype=”https://schema.org/ListItem” | li タグ
リンク | 	itemprop=”item”  | 	a タグ
パンくず名 | itemprop=”name”  | a タグ直下の spanなど
順番 | itemprop=”position” | meta タグ
  

上で書いたパンくずリストを microdata で書いてみたいと思います。  

```html
<ul itemscope itemtype="https://schema.org/BreadcrumbList">
  <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
    <a itemprop="item" href="https://www.takurinton.com/">
        <span  itemprop="name">たくりんとん</span>
    </a>
    <meta itemprop="position" content="1" />
  </li>
  <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
    <a itemprop="item" href="https://www.takurinton.com/me/">
        <span itemprop="name">僕について | たくりんとん</span>
    </a>
    <meta itemprop="position" content="2" />
  </li>
</ul>
```

このような形で表現することができます。JSON-LD では JSON で表していました。  
個人的にはネストしてる部分などが見やすいため JSON-LD の方が見やすいのかなと思いますが、直接タグなどの要素に記述できるのは簡単でいいのかなと感じました。  

## まとめ

JSON-LD と microdata について説明してきましたが、今後 SEO 対策のためにとても重要なことなので積極利用していきたいなと思いました。  
また、今回はパンくずリストをメインで触れましたがその他にも指定するべきことがあるのでそこらへんもうまく使って Google 先生に媚を売っていけるようにしましょう。
