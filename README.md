# Handif to eMIPS
Easy MIPS Assemby Generator with Handif language.

How about to enjoy machine code?
 
``` fortran
begin main
  alias [
    number1 = s0,
    number2 = s1,
    result =  s2
  ]
  
  number1 = 10
  number2 = 20
  
  call add with number1 number2 to result
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
BGN_MAIN:                                                                                                                                                             
addi $s0, $zero, 10                                                                                                                                                   
addi $s1, $zero, 20                                                                                                                                                   
add $a0, $zero, $s0                                                                                                                                                   
add $a1, $zero, $s1                                                                                                                                                   
jal BGN_ADD                                                                                                                                                           
add $s2, $zero, $V0                                                                                                                                                   
j EXIT_PROCESS                                                                                                                                                        
BGN_ADD:                                                                                                                                                              
add $t0, $a0, $a1                                                                                                                                                     
add $v0, $zero, $temp                                                                                                                                                 
jr $ra                                                                                                                                                                
EXIT_PROCESS:    
```