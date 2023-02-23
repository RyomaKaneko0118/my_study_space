# 再帰関数を使って階乗を求めるサンプルコード

def calculate_factorial(n):
    if n == 0:
        return 1
    else:
        return n * calculate_factorial(n - 1)

n = 10
message = f"10! = {calculate_factorial(n)}"

print(message)

result = 10 * 9 * 8 * 7 * 6 * 5 * 4 * 3 * 2 * 1
message = f"{str(result)} = {result}"
print(message)