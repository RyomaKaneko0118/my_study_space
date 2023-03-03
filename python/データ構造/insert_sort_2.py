import random
MAX = 15
data = [0] * MAX

for i in range(MAX):
    data[i] = random.randint(i, 99)

message = f"元のデータ: {data}"
print(message)

for i in range(1, MAX):
    print(data)
    tmp = data[i]
    j = i

    while j > 0 and data[j -1] > tmp:
        data[j] = data[j -1]
        j = j -1
    data[j] = tmp
message = f"ソート後のデータ: {data}"
print(message)