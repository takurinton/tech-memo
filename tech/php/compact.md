---
title: compact 関数に関して
head:
  - - meta
    - name: og:title
      content: 技術メモ | compact 関数に関して
  - - meta
    - name: twitter:title
      content: 技術メモ | compact 関数に関して
  - - meta
    - name: og:description
      content: 技術メモ | compact 関数って便利だな〜（小並感）って思ったのでメモ
  - - meta
    - name: twitter:description
      content: 技術メモ | compact 関数って便利だな〜（小並感）って思ったのでメモ
  - - meta
    - name: og:image
      content: https://res.cloudinary.com/dtapptgdd/image/upload/w_1000/l_text:Sawarabi Gothic_70_bold:compact 関数に関して/v1620370500/Screen_Shot_2021-05-07_at_15.54.47_extlvu.png
  - - meta
    - name: twitter:image
      content: https://res.cloudinary.com/dtapptgdd/image/upload/w_1000/l_text:Sawarabi Gothic_70_bold:compact 関数に関して/v1620370500/Screen_Shot_2021-05-07_at_15.54.47_extlvu.png
---

# {{ $frontmatter.title }}

## compat 関数とは

compat 関数とは PHP の組み込み関数の1つで、変数をキーとバリューの関係にしてくれるという関数です。  
使い方としては以下のような形になります。  

```php
$name  = "takurinton";
$age = 21;
$event = "me";

$me = array("name", "age");

$result = compact("me", $me);
echo $result;
```

このような形にすると出力は以下のようになります。  

```php
Array
(
    [me] => me
    [name] => takurinton
    [age] => 21
)
```

こんな感じで例えば今持ってる変数を連想配列にしてから JSON に変換してレスポンスを返したいなどという時に有効に利用できます。  
今働いてるところでもこのような使用方法はよく見かけるため、便利だな〜とか思ってました。  

## コード見てみよう

実際にコードを見てみると [この部分](https://github.com/php/php-src/blob/41a28cea104b88d489ba8f82c4ce10055d542cfd/ext/standard/array.c#L2450-L2484) で定義されているようです。  


```c
static void php_compact_var(HashTable *eg_active_symbol_table, zval *return_value, zval *entry) /* {{{ */
{
	zval *value_ptr, data;

	ZVAL_DEREF(entry);
	if (Z_TYPE_P(entry) == IS_STRING) {
		if ((value_ptr = zend_hash_find_ind(eg_active_symbol_table, Z_STR_P(entry))) != NULL) {
			ZVAL_DEREF(value_ptr);
			Z_TRY_ADDREF_P(value_ptr);
			zend_hash_update(Z_ARRVAL_P(return_value), Z_STR_P(entry), value_ptr);
		} else if (zend_string_equals_literal(Z_STR_P(entry), "this")) {
			zend_object *object = zend_get_this_object(EG(current_execute_data));
			if (object) {
				ZVAL_OBJ_COPY(&data, object);
				zend_hash_update(Z_ARRVAL_P(return_value), Z_STR_P(entry), &data);
			}
		} else {
			php_error_docref(NULL, E_WARNING, "Undefined variable $%s", ZSTR_VAL(Z_STR_P(entry)));
		}
	} else if (Z_TYPE_P(entry) == IS_ARRAY) {
	    if (Z_REFCOUNTED_P(entry)) {
			if (Z_IS_RECURSIVE_P(entry)) {
				zend_throw_error(NULL, "Recursion detected");
				return;
			}
			Z_PROTECT_RECURSION_P(entry);
		}
		ZEND_HASH_FOREACH_VAL(Z_ARRVAL_P(entry), value_ptr) {
			php_compact_var(eg_active_symbol_table, return_value, value_ptr);
		} ZEND_HASH_FOREACH_END();
	    if (Z_REFCOUNTED_P(entry)) {
			Z_UNPROTECT_RECURSION_P(entry);
		}
	}
}
```

zend_hash_find_ind という関数で与えられた変数名に紐づく値を取り出して return 用の配列に入れているような実装でした。

具体的にはここら辺です。  

```c
if ((value_ptr = zend_hash_find_ind(eg_active_symbol_table, Z_STR_P(entry))) != NULL) {
 ZVAL_DEREF(value_ptr);
 ZVAL_COPY(&data, value_ptr);
 zend_hash_update(Z_ARRVAL_P(return_value), Z_STR_P(entry), &data);
}
```

## まとめ
これ結構使い勝手いいかも。