LEFT = 0
RIGHT = 1
DATA = 2
node = [
    [1, 2, 10],
    [3, 4, 20],
    [5, None, 30],
    [None, None, 40],
    [6, 7, 50],
    [None, None, 60],
    [None, None, 70],
    [None, None, 80],
]
MAX = len(node)

message = "指定の番号のノードを調べます"
print(message)
message = "何も入力せずにEnterを押すと終了します"
print(message)

while True:
    message = "number="
    s = input(message)
    if s == "":
        break

    try:
        n = int(s)
    except:
        message = "数値を入力して下さい"
        print(message)
        continue

    if 0 <= n and n < MAX:
        message = f"node{n}の値は{node[n][DATA]}"
        print(message)

        left = node[n][LEFT]
        if left != None:
            message = f"左の子は{str(node[left][DATA])}"
            print(message)
        else:
            message = "左の子は存在しません"
            print(message)
        
        right = node[n][RIGHT]
        if right != None:
            message = f"右の子は{str(node[right][RIGHT])}"
            print(message)
        else:
            message = "右の子は存在しません"
            print(message)
