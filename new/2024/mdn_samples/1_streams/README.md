処理の流れ
1. フェッチした後、streamを取り出す(response.body)
2. 取り出したストリームからリーダーを取り付ける(rs.getReader())
3. リーダーからストリームを読み込む(ReadableStream)、または書き込む

ストリームを読み込む処理(ReadableStream)
1. ストリームを読み込む関数を作成
2. 読み込むストリームがない場合は関数から戻る
3. 読み込むストリームがある場合は、現在のチャンクを処理し、関数を再度実行する。
4. 読み取るストリームがなくなるまで、関数を再帰的に実行し続ける。

ポイント
* 一つのストリームに対して、リーダーは一つしか取り付けることができない。(ロックが発生する)
* オリジナルのストリームに複製することは可能(tee)

Examples:
* [Simple stream pump](http://mdn.github.io/dom-examples/streams/simple-pump/): This example shows how to consume a ReadableStream and pass its data to another.
* [Grayscale a PNG](http://mdn.github.io/dom-examples/streams/grayscale-png/): This example shows how a ReadableStream of a PNG can be turned into grayscale.
* [Simple random stream](http://mdn.github.io/dom-examples/streams/simple-random-stream/): This example shows how to use a custom stream to generate random strings, enqueue them as chunks, and then read them back out again.
* [Simple tee example](http://mdn.github.io/dom-examples/streams/simple-tee-example/): This example extends the Simple random stream example, showing how a stream can be teed and both resulting streams can be read independently.
* [Simple writer](http://mdn.github.io/dom-examples/streams/simple-writer/): This example shows how to to write to a writable stream, then decode the stream and write the contents to the UI.
* [Transform binary chunks to strings](http://mdn.github.io/dom-examples/streams/strings-transform-stream/): In this example, binary data chunks of a text file are converted to string lines by a [```TransformStream```](https://developer.mozilla.org/en-US/docs/Web/API/TransformStream).
* [Unpack chunks of a PNG](http://mdn.github.io/dom-examples/streams/png-transform-stream/): This example shows how [```pipeThrough()```](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream/pipeThrough) can be used to transform a ReadableStream into a stream of other data types by transforming a data of a PNG file into a stream of PNG chunks.
