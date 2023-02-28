import random
MAX = 15
data = [0] * MAX

for i in range(MAX):
    data[i] = random.randint(i, 200)

def merge(left, middle, right):
    buffer = [0] * (right - left)
    i = left
    j = middle
    p = 0
    print("-- P --")
    print(p)

    while i < middle and j < right:
        if data[i] <= data[j]:
            buffer[p] = data[i]
            i += 1
            p += 1
        else:
            buffer[p] = data[j]
            j += 1
            p += 1
    
    while i < middle:
        buffer[p] = data[i]
        i += 1
        p += 1

    while j < right:
        buffer[p] = data[i]
        i += 1
        p += 1
    
    for n in range(left, right):
        data[n] = buffer[n - left]

message = f"元のデータ: {data}"
print(message)
s = 2

while s <= MAX:
    loop = MAX // s
    fragment = MAX%s
    for i in range(loop):
        merge(i * s, i * s + (s))

message = f"ソート後のデータ: {data}"
print(message)