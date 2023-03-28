require 'openssl'
# 復号化するデータ
encrypted_data = "\xAF\xE4\x4F\x45\xCB\xD4\xD6\xE7\x2D\xC4\xAF\x53\xA9\x13\xA9\xB6"

# 復号化に使用するキーと初期化ベクトル
key = "0123456789ABCDEF0123456789ABCDEF"
iv = "0123456789ABCDEF"

# Cipherオブジェクトを作成し、復号化モードに設定する
cipher = OpenSSL::Cipher::Cipher.new('aes-256-cbc')
cipher.decrypt

# キーと初期化ベクトルを設定する
cipher.key = key
cipher.iv = iv

# 復号化を行う
decrypted_data = cipher.update(encrypted_data)

# 復号化されたデータを出力する
puts decrypted_data
