data = [45, 78, 71, 14, 1, 9, 65, 85]
message = f"元のデータ: {data}"
print(message)
MAX = len(data)

for i in range(0, MAX -1):
    m = i
    for j in range(i +1, MAX):
        if data[j] < data[m]:
            m = j
    
    data[i], data[m] = data[m], data[i]
    
message = f"ソート後のデータ: {data}"
print(message)