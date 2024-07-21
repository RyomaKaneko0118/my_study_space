a = [1, 3, 4, 7, 8, 9]
b = [0, 2, 5, 6]
sizeA = len(a)
sizeB = len(b)
result = [0] * (sizeA + sizeB)

i = 0
j = 0
p = 0

text = f"データA: {a}"
print(text)
text = f"データB: {b}"
print(text)

while i < sizeA and j < sizeB:
    if a[i] <= b[j]:
        result[p] = a[i]
        i += 1
        p += 1
    else:
        result[p] = b[j]
        j += 1
        p += 1

while i < sizeA:
    result[p] = a[i]
    i += 1
    p += 1

while j < sizeB:
    result[p] = b[i]
    j += 1
    p += 1

text = f"マージ後のデータ: {result}"
print(text)