---
title: Blitz について学ぶ
head:
  - - meta
    - name: og:title
      content: 技術メモ | Blitz について学ぶ
  - - meta
    - name: twitter:title
      content: 技術メモ | Blitz について学ぶ
  - - meta
    - name: og:description
      content: 技術メモ | Blitz について学んでみる
  - - meta
    - name: twitter:description
      content: 技術メモ | Blitz について学んでみる
  - - meta
    - name: og:image
      content: https://res.cloudinary.com/dtapptgdd/image/upload/w_1000/l_text:Sawarabi Gothic_70_bold:Blitz について学ぶ/v1620370500/Screen_Shot_2021-05-07_at_15.54.47_extlvu.png
  - - meta
    - name: twitter:image
      content: https://res.cloudinary.com/dtapptgdd/image/upload/w_1000/l_text:Sawarabi Gothic_70_bold:Blitz について学ぶ/v1620370500/Screen_Shot_2021-05-07_at_15.54.47_extlvu.png
---

# {{ $frontmatter.title }}

Blitz について周辺を漁ってみてまとめる。  
学ぶとか書いてあるけど動向は去年の夏くらいから追ってるし、議論やコードの変化などもここまで観察してきてる。  
去年の11月くらいにプライベートリポジトリでちょこちょこいじったが意外と楽しかった。が、今回はコードベースの話は書かない（あくまで自分のレポジトリ見てくれ的な感じ）

## Blitz とは  
[ドキュメント](https://blitzjs.com/)  
[コード](https://github.com/blitz-js/blitz)  

Blitz とは Next.js + Prisma で構成されているフルスタックなフレームワークで、React on Rails と呼ばれている。  
様々なベストプラクティスの集合であり、コードジェネレーターもついている。  
スターターもついていて、`blitz new myAppName` とかいうコマンドで簡単にプロジェクトを作成することができる。  
また、[RPC 変換](https://blitzjs.com/docs/rpc-specification) を使用した isomorphic なリモート関数の呼び出しができる。  
要はフロントエンドからサーバサイドの関数が呼べたりする。
これによって内部的に PRC 変換をすることでクライアントからサーバの関数を import しただけで呼べてるように見える。意識上のセキュリティ上の問題は発生しそうではあるが、フロントエンドもサーバサイドも Node.js で書いているからこそ isomorphic に関数を使用することができるとても良い機能だなと思った。  
  
また、デフォルトで GraphQL を使用していることも特徴的で現代風だなと感じた。  
自分は GraphQL についての知見が浅いが、これはこれで楽しいし、やりやすいなと感じた。僕の GraphQL 物語は [ブログのこの記事](https://blog.takurinton.com/post/58) とかに書いてあります。（宣伝なので敬体）  
  

## Node.js のフルスタックフレームワークについて  

Node.js の歴史はそこそこ長い（JS という括りで見ればもっと長い）が、これまでフルスタックなフレームワークは流行ってこなかった。  
理由はたくさんありそうだが、ORM が不足していたような気がする。  
ORM といえば多くの言語で実装されているが、型が付き難かったりすることが課題だった。特に JS はゆるふわ言語なのでそこらへんが難しい。そこで Prisma のような GraphQL ファーストな設計でかつ TS に優しい ORM が出てきたことによって流行ってきたと考えられる。  
また、宣言的なマイグレーションをすることができるのも大きいと考えている。自動でマイグレーションをしてくれることはとてもありがたいし、ORM としてついてて欲しい機能ではあったが Node.js ベースのものにそれは存在していなかった。  
また、どのような SQL が吐かれているかを容易に想像することができるあたりも感触が良いなと感じた。
  
Node.js のフレームワークで言うと Express や Fastify があるが、あれは Golang でいう gin のような感じでどちらかというとフレームワークというよりはミドルウェアの集合体のような位置付けだった。  
  
## Prisma について

Prisma と当たり前に書いてきたが、Prisma とは graphcool という GraphQL as a Service のバックエンド部分を切り出したフレームワークである。（なんだそれ）  
  
例えば  

```ts
model User {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now())
  email     String   @unique
  name      String?  
  role      Role     @default(USER)
  posts     Post[]
}
```

という型をかいて

```bash
prisma generate --schema ./database/myschema.prisma
```

とかいうコマンドを叩くと先ほどのモデルの CRUD が自動生成された上で GraphQL API としても実行可能になるとかいう文明の利器のようなフレームワークである。  
  
こやつを取り出したいときはめちゃくちゃ簡単で  

```ts
const posts = await prisma.user.findMany()
```

のような形で非同期関数として取り出すことができる。  

検索は  

```ts
const postsWithAuthors = await prisma.user.findMany({
  include: { name: 'takurinton' },
})
```

のような形で検索することができる。めちゃくちゃ簡単。  
めちゃくちゃ簡単とか言ったけどまあ普通の ORM って感じ。ただ、GraphQL ファーストになるのはめちゃくちゃいいと思ってる。  

## 僕が思うこと

個人的にはいいとは思うけど興味はないって感じかもしれない。  
まあこれは思想だし、元々薄いフレームワークで自由度高く実装するのが好きというだけなので深い理由はない。  
ただ、Prisma には興味を持った。個人的にサーバサイドでどのようなフレームワークを使うのかについては疑問に思っていたし、そこで GraphQL に優しい ORM があると知れば使ってみたいなとかは思った。（いつになるか知らないkど）  
また、isomorphic な関数呼び出しやコンポーネントの管理なども好きなのでそこらへんには共感できた。いつかプロダクション環境で使ってみたいなとか思った。 


## Blitz の将来

[なんか議論してたんだよなあ。。。](https://github.com/blitz-js/blitz/discussions/1990)  
  
なんかそれに対する [クソ記事](https://qiita.com/rana_kualu/items/69ef668e240ae9ccec87) を見つけてしまった。この記事に対してクソって言いまくってたら彼女がなんかツイートしてた。（気になる人は見てみてください）  
そのツイートに対してブラ○ドンちゃんが「Oh...」って言ってて笑っちゃった。
  
要はカスタムコンパイラを取り除き、よりネイティブな形で Blitz を作って行こうぜみたいな感じ。  
そのために Blitz を Next.js のアドオンとしてだけ使うか、Next.js のコアをいじいじするかの二択に迫られてるよおみたいな話だった。  
  
気になる人は例のやつ見て貰えばいいのですが、結局は [Next.js を fork](https://github.com/blitz-js/next.js) して頑張っていくみたいです。
まあこれ正直個人的には渋いと思っていて、マージに耐えられなくなったり Next.js 側との連携に苦労して破綻する未来も見えてしまうかなとか思ってる。そこはブ○ンドンちゃんの腕の見せ所みたいな感じかもしれない。  
興味がないとは言ってるが期待はしてるので頑張って欲しいと思っている。

## まとめ

Node.js ベースのフルスタックフレームワーク、正直期待しているのでこれからどうなるかにさらに注目しつつ、機会があればコミットするなどして楽しんで追って行きたい。