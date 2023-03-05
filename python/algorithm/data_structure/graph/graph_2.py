data = [
    [0, 1, 1, 1, 0],
    [1, 0, 1, 1, 0],
    [1, 1, 0, 0, 1],
    [1, 1, 0, 0, 1],
    [0, 0, 1, 1, 0]
]
node = [
    "(0)", "(1)", "(2)", "(3)", "(4)"
]

MAX = len(data)
for y in range(MAX):
    for x in range(y, MAX):
        if data[y][x] == 1 and data[x][y] == 1:
            message = f"{node[y]} <-> {node[x]}"
            print(message)