---
title: wmr と preact-iso について
head:
  - - meta
    - name: og:title
      content: wmr と preact-iso について
  - - meta
    - name: twitter:title
      content: wmr と preact-iso について
  - - meta
    - name: og:description
      content: isomorphic な preact で最近注目してるのでまとめる
  - - meta
    - name: twitter:description
      content: isomorphic な preact で最近注目してるのでまとめる
---

# {{ $frontmatter.title }}

## wmr とは
[wmr](https://github.com/preactjs/wmr) とは preact で isomorphic なコードを書くためのライブラリです。  

README には以下のことが書かれています。  

::: tip
🔨  No entry points or pages to configure - just HTML files with `<script type=module>`  
🦦   Safely import "packages" from npm without installation  
📦   Smart bundling and caching for npm dependencies  
↻   Hot reloading for modules, Preact components and CSS  
⚡️   Lightning-fast JSX support that you can debug in the browser  
💄   Import CSS files and CSS Modules (*.module.css)  
🔩   Out-of-the-box support for TypeScript  
📂   Static file serving with hot reloading of CSS and images  
🗜   Highly optimized Rollup-based production output (wmr build)  
📑   Crawls and pre-renders your app's pages to static HTML at build time  
🏎   Built-in HTTP2 in dev and prod (wmr serve --http2)  
🔧   Supports Rollup plugins, even in development where Rollup isn't used  
:::

また、

> The tiny all-in-one development tool for modern web apps, in a single 2mb file with no dependencies.

と説明されています。  

モダンなオールインワンツールとのことなのでどんなものなのか気になっていました。  
ざっと見た感じ、wmr は開発者が開発から本番まで Web アプリを構築できるようにすることを想定して開発されたようです。  
wmr は他の多くの単一開発ツールと比較して次の特徴を持っています。

- パフォーマンス
- SSR
- 安全な import と依存関係の適切なバンドル
- HTTP2 のサポート
- rollup のサポート

これらについて1つずつ見ていきたいと思います。  

##### パフォーマンス

wmr ではエントリポイントなしで初期化が行われます。  
`<script type=module>` のみが含まれている html が生成されます。  
そのためバンドルの手間が省けて非常に高速に動作します。

#### SSR(server side rendering)

wmr は、SSR を利用することができるように構築されています。  
ビルド時にアプリケーションのページを string の html に prerendering してくれます。


#### 安全な import と依存関係の適切なバンドル

wmr では install 不要でライブラリを import することができます（は？）  
意味がわかりませんでしたが、install したライブラリが他のライブラリとの依存関係を持っていたとしてもそこはよしなに解決してくれるといったものです。  

本家では以下のように書かれています。  

> Safely import "packages" from npm without installation.

へ〜。まあそういうことです（ぇ  

また、wmr では npm の依存関係をいつでもバンドルすることができ、ビルドマシンにキャッシュを残しています。

>  Smart bundling and caching for npm dependencies.

#### HTTP2 のサポート

> Built-in HTTP2 in dev and prod (wmr serve --http2)  

wmr には、開発モードと本番モードでのHTTP2のサポートが組み込まれています。

#### rollup のサポート

[vitejs](https://github.com/vitejs/vite) もそうですが、最近話題のライブラリ/フレームワークは rollup へのサポートが手厚く、プラグインが充実している印象を受けます。  

> Supports Rollup plugins, even in development where Rollup isn't used  


wmr では開発で使用されていない場合でも rollup プラグインのサポートを提供しています。（これがどうなのかはわからない）  
ビルド時には rollup を使用しているため互換性があるということでしょうか。  
vitejs もそのような理由で rollup(esbuild) のプラグインが多いような気がします。

## preact-iso とは

[preact-iso](https://github.com/preactjs/wmr/tree/main/packages/preact-iso) は wmr にラッピングされてる isomorphic なコードを書くためのライブラリです。  

特徴としては、`lazy()` と `<ErrorBoundary>` を使用して非同期でコンポーネントを読み込むことができるため、段階的な hydration が可能になります。  
また、prerendering をするための `prereinder()` 関数が用意されていて、`lazy()` との依存関係を待機します。  
ルーティングに関しては `<Router>` コンポーネントがあります。これは個人的には非常に嬉しい機能で、preact で SSR をしようとしたときに `preact-router` がブラウザルーティングなためサーバサイドの静的なルーティングができずに困っていました。しかし `preact-iso` の router はクライアント側およびサーバ側のルーティングを実装しています。

#### lazy.js 

遅延して読み込むためのコンポーネントを作成します。  
コンポーネントに解決される非同期の関数コンポーネントを受け取り、そのコンポーネントをラッピングして返します。  
コンポーネントが最初にレンダリングされたときにのみロードされる場合でも、ラッパーコンポーネントはすぐにレンダリングできます。

```jsx
import { render } from 'preact';
import { lazy, ErrorBoundary } from 'preact-iso/lazy';
import { Router } from 'preact-iso/router';

const Home = lazy(() => import('./routes/home.js'));
const Profile = lazy(() => import('./routes/profile.js'));

const App = () => (
	<ErrorBoundary>
		<Router>
			<Home path="/" />
			<Profile path="/profile" />
		</Router>
	</ErrorBoundary>
);

render(<App />, document.getElementById('app'));
```

#### prerender.js
`prerender()` は、[preact-render-to-string](https://github.com/preactjs/preact-render-to-string) を使用して仮想 DOM ツリーを string の html にレンダリングします。  
`preact-render-to-string` は React でいうところの [ReactDOM.renderToStaticMarkup()](https://ja.reactjs.org/docs/react-dom-server.html#rendertostaticmarkup) です。  
  
最大の特徴は非同期であり、レンダリング（ Suspenseスタイル ）中にコンポーネントによってスローされた Promise が解決されるのを待ってから、html を返すことです。  

`prerender()` から返された Promise は html プロパティと links[] プロパティを持つオブジェクトに resolve されます。  
html プロパティには、prerendering された html が含まれ、links は生成されたページのリンクにある内部の URL 文字列の配列となります。

```jsx
import { lazy, ErrorBoundary } from 'preact-iso/lazy';
import prerender from 'preact-iso/prerender';

const Foo = lazy(() => import('./foo.js'));

const App = () => (
	<ErrorBoundary>
		<Foo path="/" />
	</ErrorBoundary>
);

const { html, links } = await prerender(<App />, { maxDepth: 10 });
```


#### hydrate.js

`hydrate()` は preact の `hydrate()` 関数のラッパーです。`prerender()` からの prerendering された出力が含まれている場合、 hydration します。それ以外の場合は prerendering をします。  
注意点として、このメソッドは rendering する前に、ブラウザコンテキストで実行されていることを確認します。実行されていない場合は、何も実行しません。
注意点と書きましたが、これは開発中に prerendering をしたくない場合に役立ちます。

```jsx
import hydrate from 'preact-iso/hydrate';

const App = () => (
	<div class="app">
		<h1>Hello World</h1>
	</div>
);

hydrate(<App />);
```

#### router.js

`router` は　preact の hooks ベースの API を備えたシンプルな router です。  
ある route から別の route に移行するときに、遷移先が Promise を throw すると、遷移元 route は新しい route の準備ができるまで保持されます。  
  

prerendering 中に生成された html には `lazy()` でラッピングされた `import` が解決されるのを待つため、`<Home>`、`<Profiles>` の出力が含まれます。  
また、`useRouter` を使用して現在の route を取得することも可能です。

```jsx
import { lazy, ErrorBoundary } from 'preact-iso/lazy';
import { LocationProvider, Router, useLocation } from 'preact-iso/router';

const Home = lazy(() => import('./routes/home.js'));
const Profile = lazy(() => import('./routes/profile.js'));
const Profiles = lazy(() => import('./routes/profiles.js'));

const App = () => (
	<LocationProvider>
		<ErrorBoundary>
			<Router>
				<Home path="/" />
				<Profiles path="/profiles" />
				<Profile path="/profiles/:id" />
			</Router>
		</ErrorBoundary>
	</LocationProvider>
);
```


## 実際どうなのか

[このツイート](https://mobile.twitter.com/preactjs/status/1339296484844589057) からも見られるように昨年の12月にリリースされた比較的新しい機能です。  
まだまだ活発に議論が行われていたりバグ報告がある状態なのでプロダクトなどの使用は避けたほうがいいかもしれません。  
ただ、個人的には欲しい機能（prerendering や サーバサイドとクライアントサイドで動作する router）がラッピングされてるのでとてもお気に入りです。  
間違いなくこれからのフロントエンドにおいて注目はされる技術だと思うので追いながら使用していきたいと思います。