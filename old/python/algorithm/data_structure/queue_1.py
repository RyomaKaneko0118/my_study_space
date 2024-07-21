# データ構造queue

MAX = 6
# 値が0で要素が5つの配列を作成する
queue = [0] * MAX
head = 0
tail = 0

def enqueue(data):
    global tail
    nt = (tail + 1 ) % MAX

    if nt == head:
        message = "これ以上データを入れられません"
        print(message)
    else:
        queue[tail] = data
        tail = nt
        message = f"データ{data}を追加しました"
        print(message)

def dequeue():
    global head

    if head == tail:
        message = "取り出すデータが存在しません"
        print(message)
        return None
    else:
        data = queue[head]
        head = (head + 1 ) % MAX
        return data

for i in range(6):
    enqueue(i)

for i in range(6):
    data = dequeue()
    message = f"取り出したデータ{data}"
    print(message)


