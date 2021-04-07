---
title: credentials を指定した際に注意するべきこと
head:
  - - meta
    - name: og:title
      content: 技術メモ | credentials を指定した際に注意するべきこと
  - - meta
    - name: twitter:title
      content: 技術メモ | credentials を指定した際に注意するべきこと
  - - meta
    - name: og:description
      content: 技術メモ | credentials を指定した際に CORS のエラーが出ることがあるのでまとめた。
  - - meta
    - name: twitter:description
      content: 技術メモ | credentials を指定した際に CORS のエラーが出ることがあるのでまとめた。
---

# {{ $frontmatter.title }}

会社の Slack で CORS の制約の話になった。（僕が個人開発で preflight エラーが出て相談したことがきっかけ、`Access-Control-Allow-Origin` はワイルドカードにしてある。）  
そこでこのようなことを言われた。

> えーと、fetchのcredentialsがtrueだと '*' が効かないってのがあったな

何それ知らない。  
てことでここについてまとめる。

## そもそも credentials とは

[credentials](https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials) はクロスオリジンリクエストの場合 User Agent が 他のドメインから Cookie を送信すべきかどうかを示します。  
credentials には以下の値を指定することができます。  

:::tip
- `omit`  
決してクッキーを送信しない

- `same-origin`  
URL が呼び出し元のスクリプトと同一オリジンだった場合のみ、クッキーを送信する

- `include`  
クロスオリジンの呼び出しであっても、常にクッキーを送信する
:::

Cookie を送信するかどうかはセキュリティ面で非常に重要なこととなってきます。デフォルトでは `omit` が指定されていて、送信しないようになっています。

## CORS について

[CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) とは Cross-Origin Resource Sharing のことで、HTTP ヘッダーを使用して、あるオリジンに対して異なるオリジンから選択されたリソースへのアクセス権を与えるようブラウザに指示するための仕組みです。  
今回触れるのは [Access-Control-Allow-Origin](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin) についてです。  

これは指定したオリジン以外のリクエストがきたときにそれを拒否する設定です。  
ここには以下の値を設定することができます。

::: tip
- `*`   
credentials がないリクエストでは、リテラル値 "*" をワイルドカードとして指定することができます。この値はブラウザに、すべてのオリジンからのリクエストコードにリソースへのアクセスを許可するように指示します。**credentials がある時にワイルドカードを使用すると、エラーを返します。**

- `<origin>`  
オリジンを指定します。サーバーが複数のオリジンからのクライアントに対応している場合、リクエストを行った特定のクライアントのオリジンを返さなければなりません。

- `null`  
null も指定することができますが、公式では非推奨になっています。  
以下原文です。  
> Note: null should not be used: "It may seem safe to return Access-Control-Allow-Origin: "null", but the serialization of the Origin of any resource that uses a non-hierarchical scheme (such as data: or file:) and sandboxed documents is defined to be "null". Many User Agents will grant such documents access to a response with an Access-Control-Allow-Origin: "null" header, and any origin can create a hostile document with a "null" Origin. The "null" value for the ACAO header should therefore be avoided."
:::
  
  
Access-Control-Allow-Origin に null を指定することは W3C でも [このように言及されています](https://w3c.github.io/webappsec-cors-for-developers/#avoid-returning-access-control-allow-origin-null)。

## 要するに

上でも書いてありますが、credentialsがある時にワイルドカードを使用するとエラーになります。   
MDN では [ここ](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS/Errors/CORSNotSupportingCredentials) で言及されています。  
  
credentials が true になってるような時にどこからでもリクエストを受け付けるなんてなんて危険な！Trello になるぞ！ってことですね。  

[fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) で credentials を指定する際は `omit` を指定するようにと書いてあります。  
ここら辺の制約についてもっと詳しくなりたいですね。

## まとめ
CORS むずかし〜