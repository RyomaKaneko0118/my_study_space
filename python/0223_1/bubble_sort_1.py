data = [45, 78, 71, 14, 1, 9, 65, 85]
message = f"元のデータ: {data}"
print(message)
MAX = len(data)

for i in range(0, MAX -1):
    for j in range(MAX -1, i, -1):
        print(data)
        print("-----------------------------")
        print(data[j -1])
        print(data[j])
        print("-----------------------------")
        if data[j -1] > data[j]:
            data[j], data[j -1] = data[j -1], data[j]
            print(data)
    
message = f"ソート後のデータ: {data}"
print(message)