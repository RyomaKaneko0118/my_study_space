data = [45, 78, 71, 14, 1, 9, 65, 85]
n = len(data)
key = 65
flag = False
for i in range(n):
    
    if data[i] == key:
        index = i + 1
        message = f"dataの{index}番目に{key}があります"
        print(message)
        flag = True
        break

if flag == False:
    message = f"{key}は存在しません"
    print(message)