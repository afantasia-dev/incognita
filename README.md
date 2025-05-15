# incognita
scripts y cosas para filosofar sobre cifradores enigma y esas cosas (son mas notas que cosas funcionales)

## permutaciones.py
genera las permutaciones para luego implementarse en el codigo de el cypher2, bajo el conocimiento que permutaciones generadas por humanos son debiles.

## cypher2.rs
es un cifrador basico de substitucion , substituye 36 caracteres en dos etapas. toma dos argumentos de 0 a  35, la idea es por ejemplo tirar dos dados de6 (2d6) y utilizarlos como un numero de base6 de 2 digitos dos veces  cada vez que se utilize, anotando en una hoja de papel separada los settings .

ejemplo de uso :
* quiero escribir en mi diario
* tiro un dado , sale 5:  5-1=4 anoto un 4 para la segunda casilla.
* tiro el segundo dado, sale un 1: 1-1=0 anoto un 0
* el primer argumento es 40 base 6= (4x6)+(0x1)=24
* tiro un dado , sale 6:  6-1=5 anoto un 5 para la segunda casilla.
* tiro el segundo dado, sale un 6: 6-1=5 anoto un 5
* el primer argumento es 55 base 6= (5x6)+(5x1)=35
* ejecuto en la terminal: ./cypher2.exe 24 35

# to do:
* que funcione 
* agregar tercer step de substitucion
* agregar step de substitucion espejo estilo enigma
* ejecutar la substitucion en orden de barril -> b1,b2,b3,mirror,b3,b2,b1
* agregar substitucion por letra en especifico
* que funcione bien
* agregar para cambiar cyphertext a text otra vez (./cypher2.exe 24 35 'AWTF...' -> 'ABCD...' )
* que funcione bonito
* pruevas unitarias
* interfaz grafica
