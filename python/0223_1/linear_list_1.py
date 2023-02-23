MAX = 10
# 空の要素が10つある配列を作成する
dataList = [None] * MAX
pointer = [None] * MAX
head = 0

def add_list(data):
    n = -1

    for i in range(MAX):
        if dataList[i] == None:
            n = i
            break

    if n == -1:
      message = "データ領域に空きがありません"
      print(message)
      return False
    
    for i in range(MAX):
        if dataList[i] != None and pointer[i] == None:
            pointer[i] = n 
            break
    
    dataList[n] = data
    pointer[n] = None
    message = f"データ{data}を追加しました"
    print(message)
    return True

def del_list(data):
    global head
    n = -1
    
    for i in range(MAX):
        if dataList[i] == data:
            n = i
            break
    
    if n == -1:
      message = "そのデータは存在しません"
      print(message)
      return False 
    
    if n != head:
        for i in range(MAX):
            if pointer[i] == n:
                pointer[i] = pointer[n]
    else:
        head = pointer[n]
        if head == None:
            head = 0
    
    dataList[n] = None
    pointer[n] = None
    message = f"データ{data}を削除しました"
    print(message)
    return True

def put_list():
    p = head
    while True:
        message = f"{dataList[p]} → "
        print(message, end="")
        if pointer[p] == None:
            message = "EOF"
            print(message, end="")
            break
        p = pointer[p]

for i in range(10, 110, 10):
    
    add_list(i)

put_list()
print("")
del_list(40)
put_list()
print("")
del_list(70)
put_list()
print("")
del_list(20)
put_list()