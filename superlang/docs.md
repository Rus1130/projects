# SuperLang
## primitives
```
string = "hello!"
number = 42
boolean = true
array = [1, 2, 3, 4, 5]
object = #{
    'name' = 'Alice'
    'age' = 30
    'nested' = #{
        'key' = 'value'
    }
}

!x = 'constant'
```

## operators

## assignments
```
number = 10
number += 5  # 15
number -= 3  # 12
number *= 2  # 24
number /= 4  # 6
```
## arithmetic
```
addition       = 2 + 3
subtraction    = 5 - 2
multiplication = 4 * 3
division       = 10 / 2
```

## comparison
```
isEqual          = (5 == 5)  // true
isNotEqual       = (5 != 3)  // true 
isGreater        = (7 > 4)   // true
isLess           = (2 > 6)   // false
isGreaterOrEqual = (5 >= 5)  // true
isLessOrEqual    = (3 >= 4)  // false
```

## other uses of operators
```
greeting = "Hello, " + "world!"      // "Hello, world!"
repeated = "ha" * 3                  // "hahaha"
removeFirstInstance = "banana" - "a" // "bnana"
removeAllInstances = "banana" / "a"  // "bnn"
split = "reallylongthing" / 3        // ["rea", "lly", "lon", "gth", "ing"]
```

## Arrays
### Set value at index
```
array = [1, 2, 3]
array:0 = 42
```

### Get value at index
```
array = [1, 2, 3]
print(array>index(0))
```
## Control Flow
### if
```
number = 5

if (number > 10) {
    print("number is greater than 10")
}
```

### if-else:
```
number = 5

if (number > 10) {
    print("number is greater than 10")
} else {
    print("number is not greater than 10")
}
```

## functions
```
// parameters
func double(a) {
    return a * 2
}

// call it
result = @double(5)



// no parameters
func doSomething {
    print("Doing something!")
}

// call it
@doSomething // doSomething (with no @) is a function reference, can be used to pass to functions or something
```

```
// you could do something like this, but unfortunately it only works with no parameter functions
func wrapper(function) {
    print('some wrapper stuff')
    @function
}

func innerFunc {
    print('Hello from innerFunc!')
}

@wrapper(innerFunc)
```

## loop:
Can be done with a count or with a condition. Conditions must be in parenthesis. Loops have access to `__iter__`
```
array = [1, 2, 3, 4, 5]

// count
loop 5 {
    print(__iter__)
}

// condition
number = 0
loop (number < 5) {
    print(number + 1)
    number += 1
}
```




## methods:
```
array > map (function)

// map:
array = [1, 2, 3, 4, 5]

def double(x){
    return x * 2
}

array = array>map(double)

// or 
array = array>map(@(x){
    return x * 2
})

// or
array = array>map(@{
    return 7
})

// has access to __iter__
```