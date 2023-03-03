# 再帰関数を使って階乗を求めるサンプルコード

def calculate_factorial(n):
    if n == 0:
        return 1
    else:
        return n * calculate_factorial(n - 1)

for i in range(0, 21):
    message = f"{i}! = {calculate_factorial(i)}"
    print(message) 

