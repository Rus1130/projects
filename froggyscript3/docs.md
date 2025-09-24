## General Utilities & Info
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
