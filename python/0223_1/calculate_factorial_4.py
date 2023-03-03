# 再帰関数を使って階乗を求めるサンプルコード

def calculate_factorial(n):
    return n * (n -1) * (n -2) * (n -3) * (n -4) 

    
n = 5
message = f"5! = {calculate_factorial(n)}"

print(message)

result = 5 * 4 * 3 * 2 * 1
message = f"{str(result)} = {result}"
print(message)