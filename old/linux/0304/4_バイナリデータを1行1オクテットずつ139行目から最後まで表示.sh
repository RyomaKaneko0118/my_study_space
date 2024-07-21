# バイナリデータを1行1オクテットずつ139行目から最後まで表示
cat ../qdata/88/image_masked.bmp | xxd -b -c1 | sed -n '139, $p'
