## package.json関連

1. package.jsonの作成
 
```
npm init --yes
```

2. 設定の変更

```
"type": "module"の追加
```

3. タイプスクリプトのインストール

インストールするパッケージがプログラムの実行ではなく、プログラムの開発やその他の開発時のみ必要なパッケージなので、--save-devオプションをつける。
@types/nodeもインストール

```
npm install --save-dev typescript @types/node
```

4. tsconfig.jsonの設定
```
npx tsc --init
```

5. tsconfig.jsonの設定ファイルの修正

6. コンパイルと実行
```
npx tsc
node dist/index.js
```

7. より厳しく(より安全に)設定したい場合
```
 "noUncheckedIndexedAccess": true,
 "exactOptionalPropertyTypes": true  
```
