data = [1, 25, 41, 45, 78, 79, 85, 106]
MAX = len(data)
left = 0
right = MAX - 1
flag = False

try:
    message = "探す値を入力して下さい"
    key = int(input(f"{message} "))
except:
    message = "数値を入力して下さい"
    print(message)

while left <= right:
    middle = (left + right)//2
    if data[middle] == key:
        message = f"dataの{middle + 1}番目に{key}があります"
        flag = True
        break
    
    if data[middle] < key:
        left = middle + 1 
    else:
        right = middle - 1
    
if flag == False:
    message = f"その値は存在しません"
    print(message)
