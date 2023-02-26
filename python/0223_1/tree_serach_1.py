LEFT = 0
RIGHT = 1
DATA = 2
node = [
    [1, 2, 0],
    [3, 4, 1],
    [5, None, 2],
    [None, None, 3],
    [6, 7, 4],
    [None, None, 5],
    [None, None, 6],
    [None, None, 7],
]
MAX = len(node)
count = 0
def traverse(p):
    global count
    count += 1
    print(count)
    if p != None:
        traverse(node[p][LEFT])
        index = node[p][DATA] + 1 
        message = f"ノード{index}"
        print(message)
        traverse(node[p][RIGHT])
        
message = "二分探索木を通りがけ順に巡回"
print(message)
traverse(0)