disable high contrast theme checking in seamonkey:

006F8A7A: 8D4580                         lea          eax,[ebp][-080]
006F8A7D: 50                             push         eax
006F8A7E: 56                             push         esi
006F8A7F: 6A42                           push         042 ;'B'
006F8A81: C60583736E1100                 mov          b,[0116E7383],0
006F8A88: 893584736E11                   mov          [0116E7384],esi
006F8A8E: C745800C000000                 mov          d,[ebp][-080],00000000C
006F8A95: FF15989D0E11                   call         SystemParametersInfoW
006F8A9B: 85C0                           test         eax,eax
006F8A9D: EB0C                           jmps         0006F8AAB --?3  <--always jump
006F8A9F: 8A4584                         mov          al,[ebp][-07C]
006F8AA2: 2401                           and          al,1
006F8AA4: A288736E11                     mov          [0116E7388],al
006F8AA9: EB07                           jmps         0006F8AB2 --?4
006F8AAB: C60588736E1100                3mov          b,[0116E7388],0
006F8AB2: FF15909E0E11                  4call         IsAppThemed
006F8AB8: 85C0                           test         eax,eax
006F8ABA: 750F                           jnz          0006F8ACB --?5
006F8ABC: C70584736E1101000000           mov          d,[0116E7384],1
006F8AC6: E930010000                     jmp          0006F8BFB --?6
006F8ACB: 56                            5push         esi
006F8ACC: 56                             push         esi
006F8ACD: B804010000                     mov          eax,000000104
006F8AD2: 50                             push         eax
006F8AD3: 8D4D8C                         lea          ecx,[ebp][-074]
006F8AD6: 51                             push         ecx
006F8AD7: 50                             push         eax
006F8AD8: 8D8598010000                   lea          eax,[ebp][000000198]
006F8ADE: 50                             push         eax
006F8ADF: FF15849E0E11                   call         GetCurrentThemeName