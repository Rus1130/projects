## General Utilities & Info
Five hyphens (`-----`) inside of documentation denotes that below is the output of the code above.
```
out 'Hello, World!'

-----

Hello, World!
```
### Comments
```
# Comment!
#Not a comment.
```

### Types
There are 3 main types in FroggyScript3: `string`, `number`, `array`.
```
# string
'Hello, World!'
"Hello, World!"

# number
10
3.14

# array
[1, 2, 3]
['h', 'e', 'l', 'l', 'o']
```

There are also two other types: `function_reference` and `condition_statement`.
```
# function_reference
@myFunction

# condition_statement
<< 1 > 2 >>
<<true>>
<<'hello'>eq('world')>>
```
### Keyword Type Annotations
Keywords can specify the types of arguments they accept. This is how it is notated:
```
keyword [arg1_type] [arg2_type] ...
# Example:
out [string|number] # accepts either a string or number
```
If there is something that requires a variable, it is notated like so:
```
keyword [variable]

# Example:
set [variable] = [string|number|array]
```
#### Blocks
This is a block:
```
{
    # Hello!
}
```
When a keyword specifies in documentation it requires a block like this:
```
func [function_reference] [block]
if [condition_statement] [block]
```
It should be done like so:
```
func @myFunction {
    out 'Hello, World!'
}

if <<true>> {
    out 'This is true!'
}
```
## Variables
### Default Variables
There are a few default variables that exist in every FroggyScript3 program:
```
# fReturn - holds the return value of the last called function
# true    - 1
# false   - 0
```
### Creation
Variables are created with the `var` keyword and do not need a type to be specifically declared. Instead, the type is assigned based on the value given to the variable. This cannot be changed later.
```
var [variable_name] = [string|number|array]

var myString = 'Hello, World!' # string
var myNumber = 10              # number
var myArray = [1, 2, 3]        # array
```

You can create constant variables with the `cvar` keyword. These cannot be reassigned or deleted.
```
cvar [variable] = [string|number|array]

cvar myConstant = "I am constant."
free myConstant  # AccessError
set myConstant = "Try to change me."  # AccessError
```
### Reassignment
Variables can be reassigned with the `set` keyword. The type cannot be changed.
```
set [variable] = [string|number|array]

var myString = 'Hello, World!'   # string
set myString = 'Goodbye, World!' # Still a string
set myString = 10                # TypeError
```

### Deletion
Variables can be deleted with the `free` keyword.
```
free [variable]

var myString = 'Hello, World!'
free myString
out myString  # ReferenceError
```

## Output
The `out` keyword outputs a value to the console.
```
out [string|number]
```

## Control Flow
### Conditionals
The `if` keyword executes a block of code if a condition is true. An optional `else` block can be provided to execute if the condition is false.
```
if [condition_statement] [block]
else [block]

var number = 5
if <<number > 3>> {
    out 'Number is greater than 3'
}
# note: this CANNOT be on the same line as the closing brace of the if block
else {
    out 'Number is 3 or less'
}
```
### Loops
```
loop [number|condition_statement] [block]
```
If given a number, the loop will execute that many times.
```
loop 5 {
    out 'Hello, World!'
}

-----

Hello, World!
Hello, World!
Hello, World!
Hello, World!
Hello, World!
```
If given a condition statement, the loop will execute until the condition is false.
```
var count = 0
loop <<count < 5>> {
    out count
    set count = count>add(1)
}

-----

0
1
2
3
4
```
## Functions
### No Parameters
Functions without parameters are defined with the `func` keyword and called with the `call` keyword.
```
func [function_reference] [block]
call [function_reference]

func @greet {
    out 'Hello there!'
}
call @greet
```
### 1 or More Parameters
Functions with parameters are defined with the `pfunc` keyword and called with the `pcall` keyword. Parameters are defined inside of the array, with their name and type separated by a colon. Types are abbreviated as follows:
- `S` = `string`
- `N` = `number`
- `A` = `array`

If the type is missing, `SyntaxError` is raised. If the type is incorrect, `TypeError` is raised. `AccessError` will be raised if a parameterized function is called with `call`, and vice versa. Parameter variables are scoped to the entire program, so treat them as any other variable. They are automatically freed when the function ends.
```
pfunc [function_reference] [array] [block]
pcall [function_reference] [array]

pfunc @addTwo ['addTwo_num1:N', 'addTwo_num2:N'] {
    out addTwo_num1>add(addTwo_num2)
}

pcall @addTwo [3, 5]
```
### Return Values
Functions can return values with the `return` keyword. The return value is stored in the default variable `fReturn`. `return` does NOT end the function early.
```
return [string|number|array]

pfunc @getGreeting ['name:S'] {
    return 'Hello, '>concat(name)>concat('!')
}
pcall @getGreeting ['Alice']
out fReturn

-----

Hello, Alice!
```

## Methods
Methods are functions that are called on a value using the `>` operator. The value to the left of the `>` is called the `parent`. If the method has no arguments, parentheses can be omitted. If the method has arguments, parentheses are required. Methods can be chained together. Method parameters can be optional, which is denoted by `?`. In documentation, `=> return_type` indicates what type the method returns.
```
[parent_type]>[method_name]([arg1, arg2, ...]) => [return_type]
```
### Multi-type Methods
#### type
Returns the type of the parent as a string: `string`, `number`, or `array`.
```
string|number|array>type => string
```
#### length
Returns the length of the parent. For strings, this is the number of characters. For arrays, this is the number of elements.
```
string|array>length => number

'Hello, World!'>length # 13
[1, 2, 3, 4, 5]>length # 5
```
#### index
Returns the element at the specified index in an array or string. Indexing is zero-based. If the index is out of bounds, `RangeError` is raised.
```
string>index(number) => string
array>index(number) => string|number|array (whatever is in that index)
```
### String Methods
#### concat
Concatenates two strings.
```
string>concat(string) => string

'Hello, '>concat('World!') # 'Hello, World!'
```
#### eq
Compares if two strings are equal. Returns `<<1>>` if true, `<<0>>` if false.
```
string>eq(string) => condition_statement

"foo">eq("foo") # <<1>>
"foo">eq("bar") # <<0>>
```
#### neq
Compares if two strings are not equal. Returns `<<1>>` if true, `<<0>>` if false.
```
string>neq(string) => condition_statement

"foo">neq("bar") # <<1>>
"foo">neq("foo") # <<0>>
```
### Number Methods
#### inc
Increments the parent by 1.
```
number>inc => number

1>inc # 2
```
#### dec
Decrements the parent by 1.
```
number>dec => number

5>dec # 4
```
#### add
Adds two numbers together.
```
number>add(number) => number

1>add(2) # 3
```
#### sub
Subtracts the argument from the parent.
```
number>sub(number) => number

5>sub(3) # 2
```
#### mul
Multiplies two numbers together.
```
number>mul(number) => number

3>mul(4) # 12
```
#### div
Divides the parent by the argument. If dividing by zero, `MathError` is raised.
```
number>div(number) => number

10>div(2) # 5
10>div(0) # MathError
```
## Types of Errors
| Error                     | Description                                                                                                                                                                                                                |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AccessError`             |  Raised when a valid symbol (function, variable, or property) exists but is used incorrectly in its access context. Example: attempting to call a parameterized function with `call` when it must be invoked with `pcall`. |
| `ArgumentError`           | Raised when arguments provided to a keyword or method are invalid or incomplete. For example, passing too few or incorrectly typed arguments.                                                                              |
| `InternalJavaScriptError` | It's not you, it's me.                                                                                                                                                                                                     |
| `MathError`               | Raised when mathematical evaluation fails. Examples include divide-by-zero detection.                                                                                                                                      |
| `RangeError`              | Raised when a value is outside the permitted range for an operation. For example, accessing an array index that does not exist or a numeric overflow check.                                                                  |
| `ReferenceError`          | Raised when accessing an undefined identifier such as a variable, function, or method. Example: using `foo` without declaring `var foo`.                                                                                   |
| `RuntimeError`            | A catch-all for errors during program execution that don’t fall into a more specific category. e.g., a failed I/O operation or unexpected control flow issue.                                                              |
| `SyntaxError`             | Raised when the program’s structure is malformed. This is detected after tokenization but before execution. Examples include unclosed blocks, unexpected tokens, or mismatched delimiters.                                 |
| `TokenizationError`       | Raised when the tokenizer cannot recognize a sequence of characters as a valid token. This happens during the lexical analysis phase before parsing.                                                                       |
| `TypeError`               | Raised when a value of the wrong type is provided. For example, passing a number where a string is expected or calling a string-specific method on an array.                                                               |
