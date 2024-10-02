require 'zip'

summary = <<-TEXT
一つのzipファイルの中で、
Hello from ZipFileと書かれたfirst.txtファイルと、
空のa_dirディレクトリを作成する。
TEXT

puts(summary)
Zip::File.open("my.zip", create: true) {
 |zipfile|
  zipfile.get_output_stream("first.txt") { |f| f.puts "Hello from ZipFile" }
  zipfile.mkdir("a_dir")
}