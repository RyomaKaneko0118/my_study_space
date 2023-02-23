subject = ["国語", "数学", "英語", "理科", "社会"]
score = [80, 100, 92, 96, 74]
total = 0
for i in range(5):
    message = f"{subject[i]}の点数は{score[i]}"
    print(message)
    total += score[i]

print("合格点は", total)