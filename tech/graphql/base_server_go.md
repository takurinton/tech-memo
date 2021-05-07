---
title: GraphQL に入門した（Go）
head:
  - - meta
    - name: og:title
      content: GraphQL に入門した（Go）
  - - meta
    - name: twitter:title
      content: GraphQL に入門した（Go）
  - - meta
    - name: og:description
      content: GraphQL に入門しました。サーバサイドの実装です。Go言語を使用しています。
  - - meta
    - name: twitter:description
      content: GraphQL に入門しました。サーバサイドの実装です。Go言語を使用しています。
  - - meta
    - name: og:image
      content: https://res.cloudinary.com/dtapptgdd/image/upload/w_1000/l_text:Sawarabi Gothic_70_bold:GraphQL に入門した（Go）/v1620370500/Screen_Shot_2021-05-07_at_15.54.47_extlvu.png
  - - meta
    - name: twitter:image
      content: https://res.cloudinary.com/dtapptgdd/image/upload/w_1000/l_text:Sawarabi Gothic_70_bold:GraphQL に入門した（Go）/v1620370500/Screen_Shot_2021-05-07_at_15.54.47_extlvu.png
---

# {{ $frontmatter.title }}

## はじめに

最近、GraphQL に入門したので Go でサーバサイドを実装しました。  
  
[GraphQL に入門した（概念）](/tech/graphql/concept)で触れた内容は省略します。  
  
最終的なコードは以下のようになります。  

- [repo](https://github.com/takurinton/graphql_suburi)
- [ここで触れる Go のコード](https://github.com/takurinton/graphql_suburi/tree/main/backend)
- 使用ライブラリ
    - [gorm](github.com/jinzhu/gorm)
    - [graphql-go/graphql](github.com/graphql-go/graphql)
    - [mysql](github.com/go-sql-driver/mysql)

  
ディレクトリ構成としては以下のようになっています。  

- db
    - データベース接続用の関数が入っている
- model
    - struct が入っている
- repository
    - データベースアクセスをするための関数が入っている
- schema
    - GraphQL のスキーマが定義されている
    - Query も Mutation も同じ
- main.go
    - 実行

## 実装するもの

簡単な TODO リストを実装してみたいと思います。  
データの形式は以下のような形になっています。 

```sql
MariaDB > show columns from todo;
+------------+---------------+------+-----+---------------------+----------------+
| Field      | Type          | Null | Key | Default             | Extra          |
+------------+---------------+------+-----+---------------------+----------------+
| id         | int(11)       | NO   | PRI | NULL                | auto_increment |
| title      | varchar(127)  | YES  |     | NULL                |                |
| content    | varchar(1023) | YES  |     | NULL                |                |
| is_active  | tinyint(1)    | NO   |     | 1                   |                |
| created_at | timestamp     | NO   |     | current_timestamp() |                |
| updated_at | timestamp     | NO   |     | current_timestamp() |                |
+------------+---------------+------+-----+---------------------+----------------+
6 rows in set (0.001 sec)
```

## データベースとの接続

まずはローカルに DB を作っているのでそれと接続する関数を定義します。 
DB は彼女の名前に近いので MariaDB を使用しています。  
この関数をデータベースとやりとりするたびに呼び出すという感じです。
  
```go
// db/init.go

package db

import (
	"os"

    _ "github.com/go-sql-driver/mysql"
    "github.com/jinzhu/gorm"
)

func DBConn() (*gorm.DB, error) {
	DBMS := "mysql" // mariadb 
	HOSTNAME := os.Getenv("HOSTNAME")
	USERNAME := os.Getenv("USERNAME")
	DBNAME := os.Getenv("DB_NAME")
	PASSWORD := os.Getenv("PASSWORD")
	PORT := os.Getenv("PORT")

	CONNECT := USERNAME + ":" + PASSWORD + "@(" + HOSTNAME + ":" + PORT + ")/" + DBNAME + "?parseTime=true"
	db, err := gorm.Open(DBMS, CONNECT)
	if err != nil {
		return nil, err
	}

	return db, nil
}
```

## Query を定義する

次に Query を定義します。  
Query を定義するためにまずは型を定義します。  
当然ですが型はデータベースの型と合わせましょう。

```go
// schema/schema.go

var TodoType = graphql.NewObject(graphql.ObjectConfig{
	Name: "Todo",
	Fields: graphql.Fields{
		"id": &graphql.Field{
			Type: graphql.Int,
		},
		"title": &graphql.Field{
			Type: graphql.String,
		},
		"content": &graphql.Field{
			Type: graphql.String,
		},
		"is_active": &graphql.Field{
			Type: graphql.Boolean,
		},
		"created_at": &graphql.Field{
			Type: graphql.DateTime,
		},
		"updated_at": &graphql.Field{
			Type: graphql.DateTime,
		},
	},
})
```

次にフィールドを定義します。フィールドは上の型を使って TODO を全件取得するものと id に紐づく TODO を取得するものの2パターン作成します。  
`TodoFields` では特定の id に紐づく TODO を1つ使用します。  
`Args` を使用すると引数を受け取ることができます。  
`Resolve` はその後の処理を定義することができます。また、`Resolve` は GraphQL のレスポンスにもなります。  
  
`TodosFields` は `TodoFields` よりもいくらかシンプルです。  
`Resolve` の中で全件取得するようの関数を呼び出してそのまま戻り値としています。  


```go
// schema/schema.go

var TodoFields = &graphql.Field{
	Type:        TodoType,
	Description: "get post detail",
	Args: graphql.FieldConfigArgument{
		"id": &graphql.ArgumentConfig{
			Type: graphql.Int,
		},
	},
	Resolve: func(p graphql.ResolveParams) (interface{}, error) {
		id, ok := p.Args["id"].(int)
		if ok {
			post, err := repository.GetTodo(id)
			if err != nil {
				return model.Todo{}, nil
			}
			return post, nil
		}
		return model.Todo{}, nil
	},
}

var TodosFields = &graphql.Field{
	Type:        graphql.NewList(TodoType),
	Description: "get all post",
	Resolve: func(p graphql.ResolveParams) (interface{}, error) {
		return repository.GetTodos(), nil
	},
}
```

## Mutation を定義する

Mutation も同様に定義することができます。  
型は先ほどと同様に定義することができるため、フィールドのみの実装となります。  
とは言ってもやってることは変わらないのでそこまで難しくないのかなと思います。  
TODO を作成するための `CreateTodoFields` と更新するための `UpdateTodoFields` の2つを定義します。  
  
`CreateTodoFields`、`UpdateTodoFields` 共に先ほどと同様 `Args` で引数を取得します。  


```go
// schema/schema.go

var CreateTodoFields = &graphql.Field{
	Type:        TodoType,
	Description: "Create new todo",
	Args: graphql.FieldConfigArgument{
		"title": &graphql.ArgumentConfig{
			Type: graphql.NewNonNull(graphql.String),
		},
		"content": &graphql.ArgumentConfig{
			Type: graphql.NewNonNull(graphql.String),
		},
		"is_active": &graphql.ArgumentConfig{
			Type: graphql.NewNonNull(graphql.Boolean),
		},
	},
	Resolve: func(params graphql.ResolveParams) (interface{}, error) {
		title, _ := params.Args["title"].(string)
		content, _ := params.Args["content"].(string)
		isActive, _ := params.Args["is_active"].(bool)

		_newTodo := model.Todo{
			Title:    title,
			Content:  content,
			IsActive: isActive,
		}

		newTodo, err := repository.CreateTodo(_newTodo)
		if err != nil {
			fmt.Println("create data faild")
		}

		return newTodo, nil
	},
}

var UpdateTodoFields = &graphql.Field{
	Type:        TodoType,
	Description: "Create new todo",
	Args: graphql.FieldConfigArgument{
		"id": &graphql.ArgumentConfig{
			Type: graphql.NewNonNull(graphql.Int),
		},
		"title": &graphql.ArgumentConfig{
			Type: graphql.NewNonNull(graphql.String),
		},
		"content": &graphql.ArgumentConfig{
			Type: graphql.NewNonNull(graphql.String),
		},
		"is_active": &graphql.ArgumentConfig{
			Type: graphql.NewNonNull(graphql.Boolean),
		},
	},
	Resolve: func(params graphql.ResolveParams) (interface{}, error) {
		id := int64(params.Args["id"].(int)) // ちょっと汚い
		title, _ := params.Args["title"].(string)
		content, _ := params.Args["content"].(string)
		isActive, _ := params.Args["is_active"].(bool)

		_updateTodo := model.Todo{
			Id:       id,
			Title:    title,
			Content:  content,
			IsActive: isActive,
		}

		updateTodo, err := repository.UpdateTodo(_updateTodo)
		if err != nil {
			fmt.Println("update data faild")
		}

		return updateTodo, nil
	},
}
```

## Schema の定義　

最後にこれらを1つの Schema として定義します。  
先ほど一生懸命定義した関数を当てはめるだけです、簡単です。

```go
// schema/schema.go

var Schema = graphql.SchemaConfig{
	Query: graphql.NewObject(
		graphql.ObjectConfig{
			Name: "TodoQuery",
			Fields: graphql.Fields{
				"getTodo":  TodoFields,
				"getTodos": TodosFields,
			},
		},
	),
	Mutation: graphql.NewObject(
		graphql.ObjectConfig{
			Name: "TodoMutation",
			Fields: graphql.Fields{
				"createTodo": CreateTodoFields,
				"updateTodo": UpdateTodoFields,
			},
		},
	),
}
```

最後に `schema.go` で実装した内容をまとめると以下のようになります。  

```go 
// schema/schema.go

package schema

import (
	"fmt"
	"graphql_suburi/backend/model"
	"graphql_suburi/backend/repository"

	"github.com/graphql-go/graphql"
)

var TodoType = graphql.NewObject(graphql.ObjectConfig{
	Name: "Post",
	Fields: graphql.Fields{
		"id": &graphql.Field{
			Type: graphql.Int,
		},
		"title": &graphql.Field{
			Type: graphql.String,
		},
		"content": &graphql.Field{
			Type: graphql.String,
		},
		"is_active": &graphql.Field{
			Type: graphql.Boolean,
		},
		"created_at": &graphql.Field{
			Type: graphql.DateTime,
		},
		"updated_at": &graphql.Field{
			Type: graphql.DateTime,
		},
	},
})

var TodoFields = &graphql.Field{
	Type:        TodoType,
	Description: "get post detail",
	Args: graphql.FieldConfigArgument{
		"id": &graphql.ArgumentConfig{
			Type: graphql.Int,
		},
	},
	Resolve: func(p graphql.ResolveParams) (interface{}, error) {
		id, ok := p.Args["id"].(int)
		if ok {
			post, err := repository.GetTodo(id)
			if err != nil {
				return model.Todo{}, nil
			}
			return post, nil
		}
		return model.Todo{}, nil
	},
}

var TodosFields = &graphql.Field{
	Type:        graphql.NewList(TodoType),
	Description: "get all post",
	Resolve: func(p graphql.ResolveParams) (interface{}, error) {
		return repository.GetTodos(), nil
	},
}

var CreateTodoFields = &graphql.Field{
	Type:        TodoType,
	Description: "Create new todo",
	Args: graphql.FieldConfigArgument{
		"title": &graphql.ArgumentConfig{
			Type: graphql.NewNonNull(graphql.String),
		},
		"content": &graphql.ArgumentConfig{
			Type: graphql.NewNonNull(graphql.String),
		},
		"is_active": &graphql.ArgumentConfig{
			Type: graphql.NewNonNull(graphql.Boolean),
		},
	},
	Resolve: func(params graphql.ResolveParams) (interface{}, error) {

		title, _ := params.Args["title"].(string)
		content, _ := params.Args["content"].(string)
		isActive, _ := params.Args["is_active"].(bool)

		_newTodo := model.Todo{
			Title:    title,
			Content:  content,
			IsActive: isActive,
		}

		newTodo, err := repository.CreateTodo(_newTodo)
		if err != nil {
			fmt.Println("create data faild")
		}

		return newTodo, nil
	},
}

var UpdateTodoFields = &graphql.Field{
	Type:        TodoType,
	Description: "Create new todo",
	Args: graphql.FieldConfigArgument{
		"id": &graphql.ArgumentConfig{
			Type: graphql.NewNonNull(graphql.Int),
		},
		"title": &graphql.ArgumentConfig{
			Type: graphql.NewNonNull(graphql.String),
		},
		"content": &graphql.ArgumentConfig{
			Type: graphql.NewNonNull(graphql.String),
		},
		"is_active": &graphql.ArgumentConfig{
			Type: graphql.NewNonNull(graphql.Boolean),
		},
	},
	Resolve: func(params graphql.ResolveParams) (interface{}, error) {
		id := int64(params.Args["id"].(int)) // ちょっと汚い
		title, _ := params.Args["title"].(string)
		content, _ := params.Args["content"].(string)
		isActive, _ := params.Args["is_active"].(bool)

		_updateTodo := model.Todo{
			Id:       id,
			Title:    title,
			Content:  content,
			IsActive: isActive,
		}

		updateTodo, err := repository.UpdateTodo(_updateTodo)
		if err != nil {
			fmt.Println("update data faild")
		}

		return updateTodo, nil
	},
}

var Schema = graphql.SchemaConfig{
	Query: graphql.NewObject(
		graphql.ObjectConfig{
			Name: "TodoQuery",
			Fields: graphql.Fields{
				"getTodo":  TodoFields,
				"getTodos": TodosFields,
			},
		},
	),
	Mutation: graphql.NewObject(
		graphql.ObjectConfig{
			Name: "TodoMutation",
			Fields: graphql.Fields{
				"createTodo": CreateTodoFields,
				"updateTodo": UpdateTodoFields,
			},
		},
	),
}
```

## 呼び出す

ここまで定義したきたのであとは呼び出すだけです。  
main.go で `net/http` を使用してサーバを立ち上げ動作確認をしましょう。  
25行目ではバリデーションをかけています。ここでリクエストの形式が違ったり不正があったりしたら弾き、CORS エラーになるようにしています。  
また、35行目からの `graphql.Do()` で GraphQL を実行しています。

```go
// main.go 

package main

import (
	"encoding/json"
	"fmt"
	"graphql_suburi/backend/model"
	"graphql_suburi/backend/schema"
	"log"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
	"github.com/graphql-go/graphql"
)

func main() {
	http.HandleFunc("/graphql", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Headers", "*")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")

		var p model.PostData
		if r.Method == "OPTIONS" {
		} else if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
			w.WriteHeader(400)
			return
		}

		schema, err := graphql.NewSchema(schema.Schema)
		if err != nil {
			log.Fatalf("failed to get schema, error: %v", err)
		}

		result := graphql.Do(graphql.Params{
			Context:        r.Context(),
			Schema:         schema,
			RequestString:  p.Query,
			VariableValues: p.Variables,
			OperationName:  p.Operation,
		})

		if err := json.NewEncoder(w).Encode(result); err != nil {
			fmt.Printf("could not write result to response: %s", err)
		}
	})

	fmt.Println("listening on :8888 ...")
	if err := http.ListenAndServe(":8888", nil); err != nil {
		log.Fatalln(err)
	}
}
```

## 動作確認 

動作確認をします。curl でリクエストを投げたいと思います。

#### TODO を全件取得 

リクエスト  
```bash
curl -X POST -H "Content-Type: application/json" --data '{ "query": "{ getTodos { id title content  } }" }' http://localhost:8888/graphql
```  

    
レスポンス  
```json
{"data":{"getTodos":[{"content":"hoge","id":1,"title":"takumi"},{"content":"marinyan","id":2,"title":"marina"},{"content":"takurinton","id":3,"title":"test3"}]}}
```

#### id が 1 の TODO を取得 

リクエスト  
```bash
curl -X POST -H "Content-Type: application/json" --data '{ "query": "{ getTodo(id:1) { id title content  } }" }' http://localhost:8888/graphql
```
  
レスポンス
```json
{"data":{"getTodo":{"content":"hoge","id":1,"title":"takumi"}}}
```

#### TODO を作成する

リクエスト  
```bash
curl -X POST -H "Content-Type: application/json" --data '{ "query": "mutation { createTodo(title:\"takurinton\",content:\"wakuwakuwakuwaku\",is_active:true) { id title content is_active created_at } }" }' http://localhost:8888/graphql
```
  
レスポンス
```json
{"data":{"createTodo":{"content":"wakuwakuwakuwaku","created_at":"2021-04-15T12:57:22.5392956Z","id":4,"is_active":true,"title":"takurinton"}}}
```

#### id が 1 の TODO を更新

リクエスト  
```bash
curl -X POST -H "Content-Type: application/json" --data '{ "query": "mutation { updateTodo(id:1,title:\"takumi katayama\",content:\"hoge\",is_active:false) { id title content is_active created_at } }" }' http://localhost:8888/graphql
```
  
レスポンス
```json
{"data":{"updateTodo":{"content":"hoge","created_at":"0001-01-01T00:00:00Z","id":1,"is_active":false,"title":"takumi katayama"}}}
```

このような形でそれぞれのメソッドがしっかり動いてることを確認することができました。めでたしめでたし。

## まとめ

リクエストやレスポンスに型を持たせることができるのは非常に体験が良くなるなと感じました。  
ただ、自分の中でまだまだ良さに気づけていない部分や深めなければいけない部分、ベストプラクティス、一般的な書き方についての理解が足りていないのでもっと頑張ってやっていきたいと思います。