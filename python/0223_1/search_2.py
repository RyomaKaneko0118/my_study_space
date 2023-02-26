data = [
    ["Alice", "0-1-2"],
    ["Bob", "4-25-77"],
    ["Carol", "9-7-77"],
    ["Charlie", "4-77-8"],
    ["Dave", "7-44-4"]
]
MAX = len(data)
message = "検索する相手の苗字は?"
s = input(f"{message} ")
i = 0
NAME = 0
NUMBER = 1
while i < MAX and data[i][NAME] != s:
    
    i += 1

if i == MAX:
    message = f"{s}は存在しません"
    print(message)
else:
    print(i)
    message = f"{s}さんの番号は{data[i][NUMBER]}です"
    print(message)    
