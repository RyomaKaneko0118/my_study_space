require 'zip'

summary = <<-TEXT
一つのzipファイルの中で、
example_directoryディレクトリを作成し、
このディレクトリ内にThis is an example file.と書かれた、
empty_file.txtファイルを作成する
TEXT

puts(summary)
Zip::File.open('example.zip', Zip::File::CREATE) do |zipfile|
  # ディレクトリを作成
  zipfile.mkdir('example_directory')
  
  # ファイルを作成して追加
  File.open('example_file.txt', 'w') do |file|
    file.write('This is an example file.')
  end
  
  zipfile.add('example_directory/example_file.txt', 'example_file.txt')
end
