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
count = 0
def traverse(p):
    global count
    count += 1
    print(count)
    if p != None:
        traverse(node[p][LEFT])
        message = f"ノード{node[p][DATA]}"
        print(message)
        traverse(node[p][RIGHT])
        
message = "二分探索木を通りがけ順に巡回"
print(message)
traverse(0)