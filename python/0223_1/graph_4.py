data = [
    [0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0]
]
node = [
    "(0)", "(1)", "(2)", "(3)", "(4)"
]
arrow = ["", "-->", "<--", "<->",]

for y in range(5):
    for x in range(y, 5):
        edge1 = data[y][x]
        edge2 = data[x][y]
        direction = edge1 + edge2 * 2

        if direction > 0:
            message = f"{node[y]} {arrow[direction]} {node[x]}"
            print(message)
        