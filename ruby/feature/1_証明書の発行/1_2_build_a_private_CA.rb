require 'openssl'
OpenSSL::Random.seed(File.read('/dev/random', 16))
digest = OpenSSL::Digest::SHA1.new

puts(" digest -----------------------------------------------------------")
puts(digest)
puts("-------------------------------------------------------------")

ca_passphrase = 'ca_passphrase' # CA の秘密鍵に設定するパスフレーズ (適切に設定してください)

# CA の情報を設定 (適切に設定してください)
issu = OpenSSL::X509::Name.new
issu.add_entry 'C' , 'JP'
issu.add_entry 'ST', 'Tokyo'
issu.add_entry 'DC', 'Minato-ku'
issu.add_entry 'O' , 'Example, Inc.'
issu.add_entry 'CN', 'Example CA'

puts(" CA情報 -----------------------------------------------------------")
puts(issu)
puts("-------------------------------------------------------------")

# CA の秘密鍵/公開鍵を生成
issu_rsa = OpenSSL::PKey::RSA.generate 2048

puts(" CA の秘密鍵/公開鍵-----------------------------------------------------------")
puts(issu_rsa)
puts("-------------------------------------------------------------")

# CA の秘密鍵を書き出し
File.open 'ca_private_key2.pem', 'wb' do |f|
  f.write issu_rsa.export(OpenSSL::Cipher::Cipher.new('aes256'), ca_passphrase)
end
# File.open 'ca_private_key2.pem', 'wb' do |f|
#   f.write issu_rsa
# end

# CA 証明書を作成
issu_cer = OpenSSL::X509::Certificate.new
issu_cer.not_before = Time.now
issu_cer.not_after  = Time.now + 1*365*24*60*60 # 有効期限を 1 年後に設定
issu_cer.public_key = issu_rsa.public_key
issu_cer.serial  = 1
issu_cer.issuer  = issu
issu_cer.subject = issu
ex = OpenSSL::X509::Extension.new('basicConstraints', OpenSSL::ASN1.Sequence([OpenSSL::ASN1::Boolean(true)]))
issu_cer.add_extension(ex)
issu_cer.sign(issu_rsa, digest)
File.open 'ca.pem', 'wb' do | f |
  f.write issu_cer.to_pem
end