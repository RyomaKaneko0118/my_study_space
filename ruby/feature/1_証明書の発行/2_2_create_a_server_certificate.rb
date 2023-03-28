require 'openssl'
OpenSSL::Random.seed File.read('/dev/random', 16)
digest = OpenSSL::Digest::SHA1.new

ca_passphrase     = 'ca_passphrase'
domain = 'secure.example.com'

# CA 秘密鍵の再読み込み
issu_rsa = OpenSSL::PKey::RSA.new(File.read('ca_private_key.pem'), ca_passphrase)

puts(" issu_rsa-----------------------------------------------------------")
puts(issu_rsa)
puts("-------------------------------------------------------------")

issu_rsa2 = File.read('ca_private_key.pem')
puts(" issu_rsa2-----------------------------------------------------------")
puts(issu_rsa2)
puts("-------------------------------------------------------------")
# CA 証明書の再読み込み
issu_cer = OpenSSL::X509::Certificate.new(File.read('ca.pem'))
issu     = issu_cer.issuer

# サーバの情報を設定 (適切に設定してください)
sub = OpenSSL::X509::Name.new
sub.add_entry 'C' , 'JP'
sub.add_entry 'ST', 'Tokyo'
sub.add_entry 'DC', 'Minato-ku'
sub.add_entry 'O' , 'Example, Inc.'
sub.add_entry 'CN', domain

# サーバの秘密鍵/公開鍵を生成
sub_rsa = OpenSSL::PKey::RSA.generate 2048

# サーバの秘密鍵を書き出し
File.open "#{domain}.key", 'wb' do | f |
  f.write sub_rsa.export
end

# サーバ証明書を作成
sub_cer = OpenSSL::X509::Certificate.new
sub_cer.not_before = Time.now
sub_cer.not_after  = Time.now + 1*365*24*60*60 # 有効期限を 1 年後に設定
sub_cer.public_key = sub_rsa.public_key
sub_cer.serial  = 2
sub_cer.issuer  = issu
sub_cer.subject = sub
sub_cer.sign issu_rsa, digest
ex = OpenSSL::X509::Extension.new('basicConstraints', OpenSSL::ASN1.Sequence([OpenSSL::ASN1::Boolean(false)]))
sub_cer.add_extension ex
ex = OpenSSL::X509::Extension.new('nsCertType', 'server')
sub_cer.add_extension(ex)
sub_cer.sign issu_rsa, digest
File.open "#{domain}.crt", 'wb' do | f |
  f.write sub_cer.to_pem
end
