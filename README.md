# incógnita
scripts y cosas para filosofar sobre cifradores enigma y esas cosas (son más notas que cosas funcionales)

## permutaciones.py
genera las permutaciones para luego implementarse en el código del cypher2, bajo el conocimiento que permutaciones generadas por humanos son débiles.

## cypher2.rs
es un cifrador básico de sustitución, substituye 36 caracteres en dos etapas. toma dos argumentos de 0 a 35, la idea es por ejemplo tirar dos dados de6 (2d6) y utilizarlos como un numero de base6 de 2 dígitos dos veces cada vez que se utilice, anotando en una hoja de papel separada los setings .

ejemplo de uso :
* quiero escribir en mi diario
* tiro un dado , sale 5:  5-1=4 anoto un 4 para la segunda casilla.
* tiro el segundo dado, sale un 1: 1-1=0 anoto un 0
* el primer argumento es 40 base 6= (4x6)+(0x1)=24
* tiro un dado , sale 6:  6-1=5 anoto un 5 para la segunda casilla.
* tiro el segundo dado, sale un 6: 6-1=5 anoto un 5
* el segundo argumento es 55( base 6) entonces (5x6)+(5x1)=35
* ejecuto en la terminal: ./cypher2.exe 24 35

# to do:
* que funcione 
* agregar tercer step de substitucion
* agregar step de sustitución espejo estilo enigma
* ejecutar la sustitución en orden de barril -> b1,b2,b3,mirror,b3,b2,b1
* agregar sustitución por letra en especifico
* que funcione bien
* agregar para cambiar cyphertext a text otra vez (./cypher2.exe 24 35 'AWTF...' -> 'ABCD...' )
* Que funcione bonito
* pruebas unitarias
* interfaz grafica
