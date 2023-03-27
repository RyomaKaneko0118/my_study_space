require 'openssl'
OpenSSL::Random.seed File.read('/dev/random', 16)
digest = OpenSSL::Digest::SHA1.new

ca_passphrase     = 'ca_passphrase'
client_passphrase = 'client_passphrase' # クライアント証明書に設定するパスワード (適切に設定してください)

# CA 秘密鍵の再読み込み
issu_rsa = OpenSSL::PKey::RSA.new File.read('ca_private_key.pem'), ca_passphrase

# CA 証明書の再読み込み
issu_cer = OpenSSL::X509::Certificate.new File.read('ca.pem')
issu     = issu_cer.issuer

# クライアントの情報を設定 (適切に設定してください)
sub = OpenSSL::X509::Name.new
sub.add_entry 'C' , 'JP'
sub.add_entry 'ST', 'Tokyo'
sub.add_entry 'DC', 'Minato-ku'
sub.add_entry 'O' , 'Example, Inc.'
sub.add_entry 'CN', 'Example Taro'

# クライアント用の秘密鍵/公開鍵を生成
sub_rsa = OpenSSL::PKey::RSA.generate 2048

# クライアント証明書を作成
sub_cer = OpenSSL::X509::Certificate.new
sub_cer.not_before = Time.now
sub_cer.not_after  = Time.now + 1*365*24*60*60 # 有効期限を 1 年後に設定
sub_cer.public_key = sub_rsa.public_key
sub_cer.serial  = 3
sub_cer.issuer  = issu
sub_cer.subject = sub
sub_cer.sign issu_rsa, digest
File.open 'client.pem', 'wb' do | f |
  f.write sub_cer.to_pem
end

# クライアント証明書を PKCS#12 形式で作成
sub_pkcs = OpenSSL::PKCS12.create client_passphrase, 'secure.example.com', sub_rsa, sub_cer, [issu_cer]
File.open 'client.pfx', 'wb' do | f |
  f.write sub_pkcs.to_der
end