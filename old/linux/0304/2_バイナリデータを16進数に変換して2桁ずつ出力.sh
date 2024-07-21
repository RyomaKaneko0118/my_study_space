# バイナリデータを16進数に変換して2桁ずつ出力
cat ../qdata/88/image_masked.bmp | xxd -p -u | grep -o ..
