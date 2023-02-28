data = [45, 78, 71, 14, 1, 9, 65, 85]
message = f"元のデータ: {data}"
print(message)
MAX = len(data)

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