1.public_send(:+, 5)

class Foo
  def initialize data
    @key = data
  end
  private
  def do_fuga
    p 'secret'
  end
end

some = Foo.new 'XXX'
some.instance_eval{p @key} #=> "XXX"
some.instance_eval{do_fuga } #=> "secret" # private メソッドも呼び出せる

some.instance_eval 'raise' # ..:10: (eval):1:  (RuntimeError)
messg = 'unknown'
some.instance_eval 'raise messg','file.rb',999 # file.rb:999: unknown (RuntimeError)

class C ;end
a = 1
C.class_eval %Q{
  def m                   # メソッドを動的に定義できる。
    return :m, #{a}
  end
}

p C.new.m        #=> [:m, 1]

class D ;end
aa = 100
def_m = <<~TEXT
  def m                   # メソッドを動的に定義できる。
    return :m, #{aa}
  end
TEXT

D.class_eval def_m

p D.new.m        #=> [:m, 1]

class Foo
  def foo() p :foo end
  define_method(:bar, instance_method(:foo))
end
Foo.new.bar    # => :foo

class Interpreter
  def do_a() print "there, "; end
  def do_d() print "Hello ";  end
  def do_e() print "!\n";     end
  def do_v() print "Dave";    end
  Dispatcher = {
    "a" => instance_method(:do_a),
    "d" => instance_method(:do_d),
    "e" => instance_method(:do_e),
    "v" => instance_method(:do_v)
  }
  def interpret(string)
    string.each_char {|b| Dispatcher[b].bind(self).call }
  end
end

interpreter = Interpreter.new
interpreter.interpret('dave')
interpreter.interpret('eeee')
interpreter.interpret('aaaa')

# クラスのインスタンスメソッドの UnboundMethod の場合
class Foo
  def foo
    "foo"
  end
end

# UnboundMethod `m' を生成
p m = Foo.instance_method(:foo) # => #<UnboundMethod: Foo#foo>

# Foo のインスタンスをレシーバとする Method オブジェクトを生成
p m.bind(Foo.new)               # => #<Method: Foo#foo>

# Foo のサブクラス Bar のインスタンスをレシーバとする Method
class Bar < Foo
end
p m.bind(Bar.new)               # => #<Method: Bar(Foo)#foo>


# モジュールのインスタンスメソッドの UnboundMethod の場合
module Foo
  def foo
    "foo"
  end
end

# UnboundMethod `m' を生成
p m = Foo.instance_method(:foo) # => #<UnboundMethod: Foo#foo>

# Foo をインクルードしたクラス Bar のインスタンスをレシーバと
# する Method オブジェクトを生成
class Bar
  include Foo
end
p m.bind(Bar.new)               # => #<Method: Bar(Foo)#foo>

class F
  def hello
    "Bonjour"
  end
end

class D
  private
  def hello
    "Guten Tag"
  end
end
list = [F.new,D.new]

list.each{|it| puts it.hello if it.respond_to?(:hello)}
#=> Bonjour

list.each{|it| it.instance_eval("puts hello if it.respond_to?(:hello, true)")}
#=> Bonjour
#   Guten Tag

module Template
  def main
    start
    template_method
    finish
  end

  def start
    puts "start"
  end

  def template_method
    raise NotImplementedError.new
  end

  def finish
    puts "finish"
  end
end

class ImplTemplateMethod
  include Template
  def template_method
    "implement template_method"
  end
end

class NotImplTemplateMethod
  include Template

  # not implement template_method
end

puts ImplTemplateMethod.new.respond_to?(:template_method) # => true
# NotImplementedError が発生しているが、Rubyによる実装部のため true を返す
puts NotImplTemplateMethod.new.respond_to?(:template_method) # => true
# GNU/Linux で実行。C言語による実装部のため false を返す
puts File.respond_to?(:lchmod)         # => false

require "cgi"

p CGI.escape('@##')   #=> "%40%23%23"

url = "http://www.example.com/register?url=" +
  CGI.escape('http://www.example.com/index.rss')
p url
#=> "http://www.example.com/register?url=http%3A%2F%2Fwww.example.com%2Findex.rss"

params = CGI.parse("query_string")

[[1, 2], [3, 4]].flat_map { |i| i.map{ |j| j*2 } }
[[1, 2], [3, 4]].collect_concat { |i| i.map{ |j| j*2 } }

module M
end
class C < Object
  include M
end
class S < C
end

obj = S.new
p obj.is_a?(S)       # true
p obj.is_a?(C)       # true
p obj.is_a?(Object)  # true
p obj.is_a?(M)       # true
p obj.is_a?(Hash)    # false

class A
  def ok
    puts 'A'
  end
end
class B < A
  def ok
    puts 'B'
  end
end

B.new.ok   # => B

# undef_method の場合はスーパークラスに同名のメソッドがあっても
# その呼び出しはエラーになる
class B
  undef_method :ok
end
B.new.ok   # => NameError

# remove_method の場合はスーパークラスに同名のメソッドがあると
# それが呼ばれる
class B
  remove_method :ok
end
B.new.ok   # => A

class Foo
  private;   def private_foo()   end
  protected; def protected_foo() end
  public;    def public_foo()    end
end

# あるクラスのインスタンスメソッドの一覧を得る
p Foo.instance_methods(false)
p Foo.public_instance_methods(false)
p Foo.private_instance_methods(false)
p Foo.protected_instance_methods(false)

class Bar < Foo
end


class Bar
  private;   def private_foo()   end
  protected; def protected_foo() end
  public;    def public_foo()    end
end

# あるクラスのインスタンスメソッドの一覧を得る。
# 親のクラスのインスタンスメソッドも含めるため true を指定して
# いるが、Object のインスタンスメソッドは一覧から排除している。
p Bar.instance_methods(true)           - Object.instance_methods(true)
p Bar.public_instance_methods(true)    - Object.public_instance_methods(true)
p Bar.private_instance_methods(true)   - Object.private_instance_methods(true)
p Bar.protected_instance_methods(true) - Object.protected_instance_methods(true)

module X
  def foo
    puts "X1" # (1x)
    super # (2x)
    puts "X2" # (3x)
  end
end

class A
  prepend X

  def foo
    puts "A" #(1a)
  end
end

A.new.foo
# (1x) (2x)(ここの super で A#foo を呼びだす) (1a) (3x) の順に実行される
# >> X1
# >> A
# >> X2

# 2つのモジュールを X, Y を prepend X, Y という順で指定したもの
module Y
  def foo
    puts "Y1" #(1y)
    super #(2y)
    puts "Y2" #(3y)
  end
end

class B
  prepend X, Y
  def foo
    puts "B" # (1b)
  end
end

B.new.foo

module Foo
  module Bar
    module Baz
    end
  end
end
def_module_nesting = <<~TEXT
  def self.module_nesting
    p Module.nesting
  end
TEXT

Foo::Bar::Baz.module_eval def_module_nesting
Foo::Bar::Baz.module_nesting

h = { a: 1, b: 2, c: 3 }
h.transform_values {|v| v * v + 1 }  #=> { a: 2, b: 5, c: 10 }
h.transform_values(&:to_s)           #=> { a: "1", b: "2", c: "3" }
h.transform_values.with_index {|v, i| "#{v}.#{i}" }

require 'forwardable'
class Zap
   extend Forwardable
   delegate :length => :@str
   delegate [:first, :last] => :@arr
   def initialize
      @arr = %w/foo bar baz/
      @str = "world"
   end
end

zap = Zap.new
zap.length # => 5
zap.first  # => "foo"
zap.last   # => "baz"

class Zap_1
  attr_reader :arr, :str
  def initialize
    @arr = %w/foo bar baz/
    @str = "world"
  end
end

zap = Zap_1.new

begin
  p zap.length # => NoMethodError
rescue => e
  puts e
end

begin
  p zap.arr.first
rescue => e
  puts e
end

begin
  p zap.str.length
rescue => e
  puts e
end

class Foo
  def initialize
    @foo = 1
  end
end

obj = Foo.new
p obj.instance_variable_get("@foo")     #=> 1
p obj.instance_variable_get(:@foo)      #=> 1
p obj.instance_variable_get(:@bar)      #=> nil

module Foo
  def a
    'ok Foo'
  end
end

module Bar
  def b
    'ok Bar'
  end
end

obj = Object.new
obj.extend Foo, Bar
p obj.a #=> "ok Foo"
p obj.b #=> "ok Bar"

class Klass
  include Foo
  extend Bar
end

p Klass.new.a #=> "ok Foo"
p Klass.b     #=> "ok Bar"

module A
  module B
    # クラスメソッドとして定義
    extend self

    class C
      class Uncountable < Array; end

      def self.instance
        @__instance__ ||= new
      end

      attr_accessor :uncountables, :any_data

      def initialize
        @uncountables , @any_data = Uncountable.new, []
      end
    end

    def run
      C.instance
    end
  end
end