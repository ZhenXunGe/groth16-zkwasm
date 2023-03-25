pragma circom 2.0.0;

/*This circuit template checks that c is the multiplication of a and b.*/  

template IsOne() {  

   // Declaration of signals.  
   signal input a;  
   signal output b;  

   // Constraints.  
   a === 1;
   b <== a;
}

component main = IsOne();
