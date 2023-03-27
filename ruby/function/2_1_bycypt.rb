require 'bcrypt'

# パスワードのハッシュ化
password = "my_password"
hashed_password = BCrypt::Password.create(password)
puts "Hashed Password: #{hashed_password}"

# パスワードの検証
user_input = "my_password"
if BCrypt::Password.new(hashed_password) == user_input
  puts "Password Matched!"
else
  puts "Password Not Matched!"
end

password2 = "my_password"
hashed_password2 = BCrypt::Password.create(password)
puts "Hashed Password: #{hashed_password} #{hashed_password.length()}"
puts "Hashed Password2: #{hashed_password2} #{hashed_password2.length()}"

password3 = "my_pafaffaggagagaggdggegegegeassword"
hashed_password3 = BCrypt::Password.create(password3)
puts "Hashed Password3: #{hashed_password3} #{hashed_password3.length()}"

password4 = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
hashed_password4 = BCrypt::Password.create(password4)
puts "Hashed Password4: #{hashed_password4} #{hashed_password4.length()}"