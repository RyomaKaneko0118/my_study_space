require 'zip'

summary = <<-TEXT
一つのzipファイルの中で、
example_directoryディレクトリを作成し、
このディレクトリ内に空のempty_file.txtファイルを作成する
TEXT

puts(summary)
Zip::File.open('example.zip', Zip::File::CREATE) do |zipfile|
  # ディレクトリを作成
  zipfile.mkdir('example_directory')
  
  # 空のファイルを作成して追加
  empty_file = StringIO.new('')
  zipfile.get_output_stream('example_directory/empty_file.txt') do |f|
    f.write empty_file.string
  end
end
