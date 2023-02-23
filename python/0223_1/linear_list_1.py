MAX = 5
# 空の要素が5つある配列を作成する
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
      message = "データ領域に空きがありません。"
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

add_list(10)
print(dataList)