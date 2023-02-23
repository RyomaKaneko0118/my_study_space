# データ構造stack

MAX = 5
# 値が0で要素が5つの配列を作成する
stack = [0] * MAX
stack_pointer = 0

def push(data):
    global stack_pointer

    if stack_pointer < MAX:
        stack[stack_pointer] = data
        stack_pointer += 1
        message = f"データ{data}を追加しました"
        print(message)
    else:
        message = "これ以上データを入れられません"
        print(message)

def pop():
    global stack_pointer

    if stack_pointer > 0:
        stack_pointer -= 1
        return stack[stack_pointer]
    else:
        message = "取り出すデータが存在しません"
        print(message)
        return None

for i in range(6):
    push(i)

for i in range(6):
    data = pop()
    message = f"取り出したデータ{data}"
    print(message)

push(20)
data = pop()
message = f"取り出したデータ{data}"
print(message)
data = pop()
message = f"取り出したデータ{data}"
print(message)