# 再帰関数を使って階乗を求めるサンプルコード

def calculate_factorial(n):
    start = n -1
    for i in range(start, 0, -1):
        n = n * i
    
    return n

    
n = 5
message = f"5! = {calculate_factorial(n)}"

print(message)

result = 5 * 4 * 3 * 2 * 1
message = f"{str(result)} = {result}"
print(message)