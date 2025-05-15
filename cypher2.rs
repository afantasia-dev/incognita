use std::env;

static gliphs:[char; 36] = ['A', 'B', 'C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','0','1','2','3','4','5','6','7','8','9'];

 fn main()  {
 	
  let args: Vec<String> = env::args().collect();

 	let mut ringA: [usize; 36] =[19,32,15,5,23,0,35,33,3,12,8,27,6,31,34,4,25,29,26,21,24,14,11,9,10,1,16,20,2,28,30,17,22,13,18,7];
 	let mut ringB: [usize; 36] =[ 9 ,13, 16, 10,  5, 34, 14,  8, 33,  1, 26, 11,  0, 19, 12, 17, 30, 31, 32, 20, 22, 27, 35,  2, 24, 23,  7,  6, 29, 15,  3,  4, 28, 21, 25, 18];
  let mut ringC: [usize; 36] =[ 6 ,34,  2, 16,  5, 33, 21,  8, 10, 25, 32, 27, 20, 12,  0,  4, 30, 31, 35, 13, 11, 17, 26, 15,28, 18, 19,  9, 24, 22,  7, 29,  3, 14, 23,  1];
 	
  let perilla1 = &args[1];
  let perilla2 = &args[2];
  let cyphertext = &args[3];

 	let mut array1:[char; 36] = ['A', 'B', 'C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','0','1','2','3','4','5','6','7','8','9'];
  let mut array2:[char; 36] = ['A', 'B', 'C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','0','1','2','3','4','5','6','7','8','9'];
  let mut array3:[char; 36] = ['A', 'B', 'C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','0','1','2','3','4','5','6','7','8','9'];


    // Statements here are executed when the compiled binary is called.

    // Print text to the console.
  println!("INCOGNITA");

  println!("gliphs:{:?}",gliphs);

  swap(&gliphs,&mut array1,&mut ringA,perilla1.parse().unwrap());
  //println!("cypher:{:?}",array1);

  swap(&array1,&mut array2,&mut ringB,perilla2.parse().unwrap());
  //println!("cypher:{:?}",array2);

  swap(&array2,&mut array3,&mut ringC,0);
  //println!("cypher:{:?}",array3);

  swap(&array3,&mut array2,&mut ringB,perilla2.parse().unwrap());
  //println!("cypher:{:?}",array2);

  swap(&array2,&mut array1,&mut ringA,perilla1.parse().unwrap());
  println!("cypher:{:?}",array1);

}

fn swap(gorigin:&[char],arrayE: &mut [char]  ,rzero: &mut[usize],rotate: usize) {
	rzero.rotate_left(rotate);

	let mut counter:usize=0;
	for pat in rzero {
		arrayE[counter]=gorigin[*pat];
		counter=counter+1
	}

}
