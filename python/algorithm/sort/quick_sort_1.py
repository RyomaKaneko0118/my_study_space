import random
MAX = 15
data = [0] * MAX

for i in range(MAX):
    data[i] = random.randint(i, 200)

def quick_sort(left, right):
    i = left
    j = right
    p = data[(left + right)//2]
    print("-- P --")
    print(p)

    while True:
        while data[i] < p:
            i = i + 1
        while data[j] > p:
            j = j - 1
        if i >= j:
            break
        data[i], data[j] = data[j], data[i]
        print(data)
        i = i + 1
        j = j - 1
    if left < i - 1:
        quick_sort(left, i -1)
    if right > j + 1:
        quick_sort(j + 1, right)

message = f"元のデータ: {data}"
print(message)

quick_sort(0, MAX - 1)

message = f"ソート後のデータ: {data}"
print(message)