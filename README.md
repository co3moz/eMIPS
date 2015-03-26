# Handif to eMIPS
Easy MIPS Assemby Generator with Handif language.

How about to enjoy machine code?

``` c++
begin main
  alias [
    number1 = s0,
    number2 = s1,
    result =  s2
  ]
  
  number1 = 10
  number2 = 20
  
  call add with number1 number2 to s2
end main

begin add
  alias [
    temp = t0,
    a = a0,
    b = a1
  ]
  
  temp = a + b
  return temp
end add
``` 

compiled to mips
``` basic
li $A0, 10

li $T0, 4
bge $A0, $T0, IF_S0
move $A0, $A1
J IF_S1
IF_S0:
li $A0, 2
IF_S1:

li $T0, 2
beq $A0, $T0, NEXT
J JP
NEXT:
li $A0, 4
JP:
```

to mips direct
``` basic
lui $A0, 0
ori $A0, $A0, 10

lui $T0, 0
ori $T0, $T0, 2

slt $at, $A0, $T0
beq $at, $zero, IF_S0

add $A0, $A1, $zero
J IF_S1
IF_S0:
lui $A0, 0
ori $A0, $A0, 2
IF_S1:

lui $T0, 0
ori $T0, $T0, 2
beq $A0, $T0, NEXT
J JP
NEXT:
lui $A0, 0
ori $A0, $A0, 4
JP:
```
