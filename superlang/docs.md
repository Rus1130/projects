# SuperLang
## primitives:
```
string = "hello!"
number = 42
boolean = true
array = [1, 2, 3, 4, 5]
```

## operators:
```
# assignments
number = 10
number += 5  # number is now 15
number -= 3  # number is now 12
number *= 2  # number is now 24
number /= 4  # number is now 6

# arithmetic
addition = 2 + 3
subtraction = 5 - 2
multiplication = 4 * 3
division = 10 / 2

# comparison
isEqual = (5 == 5)
isNotEqual = (5 != 3)
isGreater = (7 > 4)
isLess = (2 < 6)
isGreaterOrEqual = (5 >= 5)
isLessOrEqual = (3 <= 4)
```

## setting the array of an index:
```
array = [1, 2, 3]
array:0 = 42
```

## getting the array of an index:
```
array = [1, 2, 3]
print(array>index(0))
```

## if:
```
if (number > 10) {
    print("number is greater than 10")
}
```

## if-else:
```
number = 5
if (number > 10) {
    print("number is greater than 10")
} else {
    print("number is not greater than 10")
}
```

## loop:
Can be done with a count or with a condition. Conditions must be in parenthesis. Loops have access to `__iter__`
```
array = [1, 2, 3, 4, 5]

# count
loop 5 {
    print(__iter__)
}

# condition
number = 0
loop (number < 5) {
    print(number + 1)
    number += 1
}
```




## methods:
```
array > map (function)

# map:
array = [1, 2, 3, 4, 5]

def double(x){
    return x * 2
}

array = array>map(double)

# or 
array = array>map(@(x){
    return x * 2
})

# or
array = array>map(@{
    return 7
})

# has access to __iter__
```