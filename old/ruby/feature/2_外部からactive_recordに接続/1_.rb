require 'yaml'
require 'active_record'
# config/database.ymlファイルの設定を読み込む
db_config = YAML.load_file('config/database.yml')

# 開発環境のデータベース設定を取得する
dev_db_config = db_config['development']
puts(dev_db_config)

# ActiveRecordの設定を更新する
ActiveRecord::Base.establish_connection(dev_db_config)

# テーブル名を取得する
tables = ActiveRecord::Base.connection.tables

# テーブル名をテキストファイルに書き込む
File.open('/tmp/tables.txt', 'w') do |file|
  tables.each do |table|
    file.puts table
  end
end