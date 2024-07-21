# バイナリデータを16進数に変換して2桁ずつ出力し11行目から14行目までを出力
cat ../qdata/88/image_masked.bmp | xxd -p -u | grep -o .. | sed -n '11, 14p'