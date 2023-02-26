data = [
    [0, 1, 1, 1, 1],
    [0, 0, 0, 0, 0],
    [1, 0, 0, 0, 1],
    [0, 0, 1, 0, 0],
    [0, 0, 0, 1, 0]
]
node = [
    "(0)", "(1)", "(2)", "(3)", "(4)"
]

for y in range(5):
    for x in range(y, 5):
        if data[y][x] == 1 and data[x][y] == 1:
            message = f"{node[y]} <-> {node[x]}"
            print(message)