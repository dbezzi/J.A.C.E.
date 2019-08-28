var board,
    game = new Chess();

var pheromoneInfluence;
var attractivenessInfluence;
var pheromoneInitial;
var evaporationCoefficient;
var pheromoneExcretion;
var Generations;

/* bontà a priori della casella in base al pezzo */
var pawnEvalWhite = {
        a8:  0.0, b8:  0.0, c8:  0.0, d8:  0.0, e8:  0.0, f8:  0.0, g8:  0.0, h8:  0.0,
        a7:  5.0, b7:  5.0, c7:  5.0, d7:  5.0, e7:  5.0, f7:  5.0, g7:  5.0, h7:  5.0,
        a6:  1.0, b6:  1.0, c6:  2.0, d6:  3.0, e6:  3.0, f6:  2.0, g6:  1.0, h6:  1.0,
        a5:  0.5, b5:  0.5, c5:  1.0, d5:  2.5, e5:  2.5, f5:  1.0, g5:  0.5, h5:  0.5,
        a4:  0.0, b4:  0.0, c4:  0.0, d4:  2.0, e4:  2.0, f4:  0.0, g4:  0.0, h4:  0.0,
        a3:  0.5, b3: -0.5, c3: -1.0, d3:  0.0, e3:  0.0, f3: -1.0, g3: -0.5, h3:  0.5,
        a2:  0.5, b2:  1.0, c2:  1.0, d2: -2.0, e2: -2.0, f2:  1.0, g2:  1.0, h2:  0.5,
        a1:  0.0, b1:  0.0, c1:  0.0, d1:  0.0, e1:  0.0, f1:  0.0, g1:  0.0, h1:  0.0
};

var pawnEvalBlack = {
        a8:  0.0, b8:  0.0, c8:  0.0, d8:  0.0, e8:  0.0, f8:  0.0, g8:  0.0, h8:  0.0,
        a7:  0.5, b7:  1.0, c7:  1.0, d7: -2.0, e7: -2.0, f7:  1.0, g7:  1.0, h7:  0.5,
        a6:  0.5, b6: -0.5, c6: -1.0, d6:  0.0, e6:  0.0, f6: -1.0, g6: -0.5, h6:  0.5,
        a5:  0.0, b5:  0.0, c5:  0.0, d5:  2.0, e5:  2.0, f5:  0.0, g5:  0.0, h5:  0.0,
        a4:  0.5, b4:  0.5, c4:  1.0, d4:  2.5, e4:  2.5, f4:  1.0, g4:  0.5, h4:  0.5,
        a3:  1.0, b3:  1.0, c3:  2.0, d3:  3.0, e3:  3.0, f3:  2.0, g3:  1.0, h3:  1.0,
        a2:  5.0, b2:  5.0, c2:  5.0, d2:  5.0, e2:  5.0, f2:  5.0, g2:  5.0, h2:  5.0,
        a1:  0.0, b1:  0.0, c1:  0.0, d1:  0.0, e1:  0.0, f1:  0.0, g1:  0.0, h1:  0.0
};

var knightEval = {
        a8: -5.0, b8: -4.0, c8: -3.0, d8: -3.0, e8: -3.0, f8: -3.0, g8: -4.0, h8: -5.0,
        a7: -4.0, b7: -2.0, c7:  0.0, d7:  0.0, e7:  0.0, f7:  0.0, g7: -2.0, h7: -4.0,
        a6: -3.0, b6:  0.0, c6:  1.0, d6:  1.5, e6:  1.5, f6:  1.0, g6:  0.0, h6: -3.0,
        a5: -3.5, b5:  0.5, c5:  1.5, d5:  2.0, e5:  2.0, f5:  1.5, g5:  0.5, h5: -3.0,
        a4: -3.0, b4:  0.0, c4:  1.5, d4:  2.0, e4:  2.0, f4:  1.5, g4:  0.0, h4: -3.0,
        a3: -3.0, b3:  0.5, c3:  1.0, d3:  1.5, e3:  1.5, f3:  1.0, g3:  0.5, h3: -3.0,
        a2: -4.0, b2: -2.0, c2:  0.0, d2:  0.0, e2:  0.0, f2:  0.0, g2: -2.0, h2: -4.0,
        a1: -5.0, b1: -4.0, c1: -3.0, d1: -3.0, e1: -3.0, f1: -3.0, g1: -4.0, h1: -5.0
};

var bishopEvalWhite = {
        a8: -2.0, b8: -1.0, c8: -1.0, d8: -1.0, e8: -1.0, f8: -1.0, g8: -1.0, h8: -2.0,
        a7: -1.0, b7:  0.0, c7:  0.0, d7:  0.0, e7:  0.0, f7:  0.0, g7:  0.0, h7: -1.0,
        a6: -1.0, b6:  0.0, c6:  0.5, d6:  1.0, e6:  1.0, f6:  0.5, g6:  0.0, h6: -1.0,
        a5: -1.0, b5:  0.5, c5:  0.5, d5:  1.0, e5:  1.0, f5:  0.5, g5:  0.5, h5: -1.0,
        a4: -1.0, b4:  0.0, c4:  1.0, d4:  1.0, e4:  1.0, f4:  1.0, g4:  0.0, h4: -1.0,
        a3: -1.0, b3:  1.0, c3:  1.0, d3:  1.0, e3:  1.0, f3:  1.0, g3:  1.0, h3: -1.0,
        a2: -1.0, b2:  0.5, c2:  0.0, d2:  0.0, e2:  0.0, f2:  0.0, g2:  0.5, h2: -1.0,
        a1: -2.0, b1: -1.0, c1: -1.0, d1: -1.0, e1: -1.0, f1: -1.0, g1: -1.0, h1: -2.0
};

var bishopEvalBlack = {
        a8: -2.0, b8: -1.0, c8: -1.0, d8: -1.0, e8: -1.0, f8: -1.0, g8: -1.0, h8: -2.0,
        a7: -1.0, b7:  0.5, c7:  0.0, d7:  0.0, e7:  0.0, f7:  0.0, g7:  0.5, h7: -1.0,
        a6: -1.0, b6:  1.0, c6:  1.0, d6:  1.0, e6:  1.0, f6:  1.0, g6:  1.0, h6: -1.0,
        a5: -1.0, b5:  0.0, c5:  1.0, d5:  1.0, e5:  1.0, f5:  1.0, g5:  0.0, h5: -1.0,
        a4: -1.0, b4:  0.5, c4:  0.5, d4:  1.0, e4:  1.0, f4:  0.5, g4:  0.5, h4: -1.0,
        a3: -1.0, b3:  0.0, c3:  0.5, d3:  1.0, e3:  1.0, f3:  0.5, g3:  0.0, h3: -1.0,
        a2: -1.0, b2:  0.0, c2:  0.0, d2:  0.0, e2:  0.0, f2:  0.0, g2:  0.0, h2: -1.0,
        a1: -2.0, b1: -1.0, c1: -1.0, d1: -1.0, e1: -1.0, f1: -1.0, g1: -1.0, h1: -2.0
};

var rookEvalWhite = {
        a8:  0.0, b8:  0.0, c8:  0.0, d8:  0.0, e8:  0.0, f8:  0.0, g8:  0.0, h8:  0.0,
        a7:  0.5, b7:  1.0, c7:  1.0, d7:  1.0, e7:  1.0, f7:  1.0, g7:  1.0, h7:  0.5,
        a6: -0.5, b6:  0.0, c6:  0.0, d6:  0.0, e6:  0.0, f6:  0.0, g6:  0.0, h6: -0.5,
        a5: -0.5, b5:  0.0, c5:  0.0, d5:  0.0, e5:  0.0, f5:  0.0, g5:  0.0, h5: -0.5,
        a4: -0.5, b4:  0.0, c4:  0.0, d4:  0.0, e4:  0.0, f4:  0.0, g4:  0.0, h4: -0.5,
        a3: -0.5, b3:  0.0, c3:  0.0, d3:  0.0, e3:  0.0, f3:  0.0, g3:  0.0, h3: -0.5,
        a2: -0.5, b2:  0.0, c2:  0.0, d2:  0.0, e2:  0.0, f2:  0.0, g2:  0.0, h2: -0.5,
        a1:  0.0, b1:  0.0, c1:  0.0, d1:  0.5, e1:  0.5, f1:  0.0, g1:  0.0, h1:  0.0
};

var rookEvalBlack = {
        a8:  0.0, b8:  0.0, c8:  0.0, d8:  0.5, e8:  0.5, f8:  0.0, g8:  0.0, h8:  0.0,
        a7: -0.5, b7:  0.0, c7:  0.0, d7:  0.0, e7:  0.0, f7:  0.0, g7:  0.0, h7: -0.5,
        a6: -0.5, b6:  0.0, c6:  0.0, d6:  0.0, e6:  0.0, f6:  0.0, g6:  0.0, h6: -0.5,
        a5: -0.5, b5:  0.0, c5:  0.0, d5:  0.0, e5:  0.0, f5:  0.0, g5:  0.0, h5: -0.5,
        a4: -0.5, b4:  0.0, c4:  0.0, d4:  0.0, e4:  0.0, f4:  0.0, g4:  0.0, h4: -0.5,
        a3: -0.5, b3:  0.0, c3:  0.0, d3:  0.0, e3:  0.0, f3:  0.0, g3:  0.0, h3: -0.5,
        a2:  0.5, b2:  1.0, c2:  1.0, d2:  1.0, e2:  1.0, f2:  1.0, g2:  1.0, h2:  0.5,
        a1:  0.0, b1:  0.0, c1:  0.0, d1:  0.0, e1:  0.0, f1:  0.0, g1:  0.0, h1:  0.0
};

var queenEval = {
        a8: -2.0, b8: -1.0, c8: -1.0, d8: -0.5, e8: -0.5, f8: -1.0, g8: -1.0, h8: -2.0,
        a7: -1.0, b7:  0.0, c7:  0.0, d7:  0.0, e7:  0.0, f7:  0.0, g7:  0.0, h7: -1.0,
        a6: -1.0, b6:  0.0, c6:  0.5, d6:  0.5, e6:  0.5, f6:  0.5, g6:  0.0, h6: -1.0,
        a5: -0.5, b5:  0.0, c5:  0.5, d5:  0.5, e5:  0.5, f5:  0.5, g5:  0.0, h5: -0.5,
        a4:  0.0, b4:  0.0, c4:  0.5, d4:  0.5, e4:  0.5, f4:  0.5, g4:  0.0, h4: -0.5,
        a3: -1.0, b3:  0.5, c3:  0.5, d3:  0.5, e3:  0.5, f3:  0.5, g3:  0.0, h3: -1.0,
        a2: -1.0, b2:  0.0, c2:  0.5, d2:  0.0, e2:  0.0, f2:  0.0, g2:  0.0, h2: -1.0,
        a1: -2.0, b1: -1.0, c1: -1.0, d1: -0.5, e1: -0.5, f1: -1.0, g1: -1.0, h1: -2.0
};

var kingEvalWhite = {
        a8: -3.0, b8: -4.0, c8: -4.0, d8: -5.0, e8: -5.0, f8: -4.0, g8: -4.0, h8: -3.0,
        a7: -3.0, b7: -4.0, c7: -4.0, d7: -5.0, e7: -5.0, f7: -4.0, g7: -4.0, h7: -3.0,
        a6: -3.0, b6: -4.0, c6: -4.0, d6: -5.0, e6: -5.0, f6: -4.0, g6: -4.0, h6: -3.0,
        a5: -3.0, b5: -4.0, c5: -4.0, d5: -5.0, e5: -5.0, f5: -4.0, g5: -4.0, h5: -3.0,
        a4: -2.0, b4: -3.0, c4: -3.0, d4: -4.0, e4: -4.0, f4: -3.0, g4: -3.0, h4: -2.0,
        a3: -1.0, b3: -2.0, c3: -2.0, d3: -2.0, e3: -2.0, f3: -2.0, g3: -2.0, h3: -1.0,
        a2:  2.0, b2:  2.0, c2:  0.0, d2:  0.0, e2:  0.0, f2:  0.0, g2:  2.0, h2:  2.0,
        a1:  2.0, b1:  3.0, c1:  1.0, d1:  0.0, e1:  0.0, f1:  1.0, g1:  3.0, h1:  2.0
};

var kingEvalBlack = {
        a8:  2.0, b8:  3.0, c8:  1.0, d8:  0.0, e8:  0.0, f8:  1.0, g8:  3.0, h8:  2.0,
        a7:  2.0, b7:  2.0, c7:  0.0, d7:  0.0, e7:  0.0, f7:  0.0, g7:  2.0, h7:  2.0,
        a6: -1.0, b6: -2.0, c6: -2.0, d6: -2.0, e6: -2.0, f6: -2.0, g6: -2.0, h6: -1.0,
        a5: -2.0, b5: -3.0, c5: -3.0, d5: -4.0, e5: -4.0, f5: -3.0, g5: -3.0, h5: -2.0,
        a4: -3.0, b4: -4.0, c4: -4.0, d4: -5.0, e4: -5.0, f4: -4.0, g4: -4.0, h4: -3.0,
        a3: -3.0, b3: -4.0, c3: -4.0, d3: -5.0, e3: -5.0, f3: -4.0, g3: -4.0, h3: -3.0,
        a2: -3.0, b2: -4.0, c2: -4.0, d2: -5.0, e2: -5.0, f2: -4.0, g2: -4.0, h2: -3.0,
        a1: -3.0, b1: -4.0, c1: -4.0, d1: -5.0, e1: -5.0, f1: -4.0, g1: -4.0, h1: -3.0
};


/**************************************************/

/* ritorna la codifica come "square" (a8, b1 ecc.) delle due coordinate */
var charSquare = function(x, y) {
x = 8-x;
if (y == 0) return ('a'+x); 
if (y == 1) return ('b'+x);
if (y == 2) return ('c'+x);
if (y == 3) return ('d'+x);
if (y == 4) return ('e'+x);
if (y == 5) return ('f'+x);
if (y == 6) return ('g'+x);
if (y == 7) return ('h'+x);
}



/* we put pheromone trails on squares */
var PHEROMONE = {
        a8:  1.0, b8:  1.0, c8:  1.0, d8:  1.0, e8:  1.0, f8:  1.0, g8:  1.0, h8:  1.0,
        a7:  1.0, b7:  1.0, c7:  1.0, d7:  1.0, e7:  1.0, f7:  1.0, g7:  1.0, h7:  1.0,
        a6:  1.0, b6:  1.0, c6:  1.0, d6:  1.0, e6:  1.0, f6:  1.0, g6:  1.0, h6:  1.0,
        a5:  1.0, b5:  1.0, c5:  1.0, d5:  1.0, e5:  1.0, f5:  1.0, g5:  1.0, h5:  1.0,
        a4:  1.0, b4:  1.0, c4:  1.0, d4:  1.0, e4:  1.0, f4:  1.0, g4:  1.0, h4:  1.0,
        a3:  1.0, b3:  1.0, c3:  1.0, d3:  1.0, e3:  1.0, f3:  1.0, g3:  1.0, h3:  1.0,
        a2:  1.0, b2:  1.0, c2:  1.0, d2:  1.0, e2:  1.0, f2:  1.0, g2:  1.0, h2:  1.0,
        a1:  1.0, b1:  1.0, c1:  1.0, d1:  1.0, e1:  1.0, f1:  1.0, g1:  1.0, h1:  1.0
};



/* calcola il valore a priori di quella mossa */
var heuristicValue = function (moves, singleMove) {

    var oldSquare = singleMove.from;
    var newSquare = singleMove.to;

    // bontà a priori della mossa (non partiamo da 0 per non appiattire troppo)
    var value = 20;

    // VANTAGGIO DI POSIZIONE
    var movingPiece = game.get(oldSquare);

    if      (movingPiece.type === 'p')  value += pawnEvalBlack[newSquare] - pawnEvalBlack[oldSquare];    
    else if (movingPiece.type === 'r')  value += rookEvalBlack[newSquare] - rookEvalBlack[oldSquare];    
    else if (movingPiece.type === 'n')  value += knightEval[newSquare] - knightEval[oldSquare];           
    else if (movingPiece.type === 'b')  value += bishopEvalBlack[newSquare] - bishopEvalBlack[oldSquare];
    else if (movingPiece.type === 'q')  value += queenEval[newSquare] - queenEval[oldSquare];          
    else if (movingPiece.type === 'k')  value += kingEvalBlack[newSquare] - kingEvalBlack[oldSquare];   
    
    //TODO: PEZZI PROTETTI PRIMA 

    //TODO: PEZZI PROTETTI DOPO 

    //PEZZI CHE TI PROTEGGONO PRIMA
    game.remove(oldSquare);
    var movesProtectingBefore = game.moves({verbose: true});    

        for (var j = 0; j < movesProtectingBefore.length; j++)
          if (movesProtectingBefore[j].to === oldSquare) {
            var protectingPiece = game.get(movesProtectingBefore[j].from);

            //if      (protectingPiece.type === 'p')  value -= 1;
            if (protectingPiece.type === 'r')  value -= 3;
            else if (protectingPiece.type === 'n')  value -= 2;
            else if (protectingPiece.type === 'b')  value -= 2;
            else if (protectingPiece.type === 'q')  value -= 5;
            else if (protectingPiece.type === 'k')  value -= 2;
          }

        game.put(movingPiece, oldSquare);

        //PEZZI CHE TI PROTEGGONO DOPO (ignorando la mossa dell'avversario)
        for (var j = 0; j < moves.length; j++)
          if (moves[j].to === newSquare && moves[j].from !== oldSquare) {
            var protectingPiece = game.get(moves[j].from); 

            if      (protectingPiece.type === 'p')  value += 1;
            else if (protectingPiece.type === 'r')  value += 3;
            else if (protectingPiece.type === 'n')  value += 2;
            else if (protectingPiece.type === 'b')  value += 2;
            else if (protectingPiece.type === 'q')  value += 5;
            else if (protectingPiece.type === 'k')  value += 2;
          }

    //fai la tua mossa
    game.move(singleMove);        

    var movesOppo = game.moves({verbose: true});    
    var threatened = false;    

    for (var j = 0; j < movesOppo.length; j++)  
    {
      var capturingPiece = game.get(movesOppo[j].from);

      //PEZZI AVVERSARI CHE TI MINACCIANO PRIMA
      if (movesOppo[j].to === oldSquare)
      {  
        value += 2;

/*        if      (capturingPiece.type === 'p')  value += 5;
        else if (capturingPiece.type === 'r')  value += 15;
        else if (capturingPiece.type === 'n')  value += 10;
        else if (capturingPiece.type === 'b')  value += 10;
        else if (capturingPiece.type === 'q')  value += 20;
        else if (capturingPiece.type === 'k')  value += 1;
*/
      }

      //PEZZI AVVERSARI CHE TI MINACCIANO DOPO
      if (movesOppo[j].to === newSquare)
      {
        threatened = true;
        value -= 3;
/*
        if      (capturingPiece.type === 'p')  value -= 5;
        else if (capturingPiece.type === 'r')  value -= 15;
        else if (capturingPiece.type === 'n')  value -= 10;
        else if (capturingPiece.type === 'b')  value -= 10;
        else if (capturingPiece.type === 'q')  value -= 20;
        else if (capturingPiece.type === 'k')  value -= 1;
*/
      }
    }

    //annulla la mossai
    game.undo();

    // EVENTUALE PEZZO NEMICO MANGIATO 
    var capturedPiece = game.get(newSquare);

    if      (capturedPiece === null)      value += 0; 
    else if (capturedPiece.type === 'p')  value += 10;
    else if (capturedPiece.type === 'r')  value += 50;
    else if (capturedPiece.type === 'n')  value += 30;
    else if (capturedPiece.type === 'b')  value += 30;
    else if (capturedPiece.type === 'q')  value += 90;
    else if (capturedPiece.type === 'k')  value += 1000;

    // se la casella di arrivo è minacciata, mettiamo in conto di perdere il valore del pezzo mosso
    if (threatened === true) 
    { 
      if      (movingPiece.type === 'p')  value -= 10;
      else if (movingPiece.type === 'r')  value -= 50;
      else if (movingPiece.type === 'n')  value -= 30;          
      else if (movingPiece.type === 'b')  value -= 30;
      else if (movingPiece.type === 'q')  value -= 90;          
      //else if (movingPiece.type === 'k')  value -= 1000;
    }

    if (value < 0) value = 0;
    return value; 
};

var evaporatePheromone = function () {
    for (var i = 0; i < 8; i++) 
        for (var j = 0; j < 8; j++) 
        {           
             var square = charSquare(i, j); 
             PHEROMONE[square] *= (1 - evaporationCoefficient);
        }
};

var resetPheromone = function () {
    for (var i = 0; i < 8; i++) 
        for (var j = 0; j < 8; j++) 
        {           
             var square = charSquare(i, j); 
             PHEROMONE[square] *= pheromoneInitial;
        }
};

/* pheromone trail visualization 

var redSquare = function(square, pheromone) {
    var background;    

    if (pheromone < 1) background = '#999999';
    if (pheromone >= 1 && pheromone < 2) background = '#FF1414';
    if (pheromone >= 2 && pheromone < 3) background = '#FF1E1E';
    if (pheromone >= 3 && pheromone < 5) background = '#FF2828';
    if (pheromone >= 5 && pheromone < 8) background = '#FF3232';
    if (pheromone >= 8 && pheromone < 12) background = '#FF3C3C';
    if (pheromone >= 12 && pheromone < 15) background = '#FF4646';
    if (pheromone >= 15 && pheromone < 20) background = '#FF5050';
    if (pheromone >= 20 && pheromone < 30) background = '#FF0000';
    if (pheromone >= 45 && pheromone < 50) background = '#F50000';
    if (pheromone >= 50 && pheromone < 55) background = '#EB0000';
    if (pheromone >= 55 && pheromone < 60) background = '#E10000';
    if (pheromone >= 60 && pheromone < 65) background = '#D70000';
    if (pheromone >= 65 && pheromone < 70) background = '#CD0000';
    if (pheromone >= 70 && pheromone < 75) background = '#C30000';
    if (pheromone >= 75 && pheromone < 80) background = '#B90000';
    if (pheromone >= 80) background = '#AF0000';

    var squareEl = $('#board .square-' + square);
    squareEl.css('background', background);
};*/



/* board visualization and games state handling */

var onDragStart = function (source, piece, position, orientation) {
    if (game.in_checkmate() === true || game.in_draw() === true || piece.search(/^b/) !== -1) 
        return false;
};

var AntColony = function (game) {

  // Initialize probabilities
  var probabilitiesSum = 0.0;
  var index = 0;
  var probabilities = {};

  // mosse indicate come stringa "san"
  var shortMoves = game.moves();
  for (var i = 0; i < shortMoves.length; i++)
     probabilities[shortMoves[i]] = 0.0;

  
  /* ANT COLONY */
  resetPheromone();

  for (var gen = 0; gen < Generations; gen ++)
  {
    for (var i = 0; i < 8; i++) 
      for (var j = 0; j < 8; j++) 
      {           
         var casella = charSquare(i, j); 
  
         // genera tutte le mosse legali da quel quadretto
         var moves = game.moves({
         square: casella,
         verbose: true
         });
 
         // singola formica (valuta tutte le mosse di uno specifico pezzo)
         for (var k = 0; k < moves.length; k++)
         {  
            var value = heuristicValue (moves, moves[k]);  

            var tauFactor = Math.pow(PHEROMONE[casella], pheromoneInfluence);
            var etaFactor = Math.pow(value, attractivenessInfluence);

            var probabilityOfTakingThisMove = tauFactor * etaFactor;
            probabilities[moves[k].san] = probabilityOfTakingThisMove; 
            probabilitiesSum += probabilityOfTakingThisMove; 
        }

        // Draw a number between 0 and the sum of probabilities
        var drawn = Math.random() * probabilitiesSum;

        // Get which edge should be taken and move using this edge
        var probabilityRan = 0;
        for (let k = 0; k < moves.length; k++) 
        {
           var probabilityBeforeSum = probabilityRan;
           probabilityRan += probabilities[moves[k].san];
            if (probabilityBeforeSum <= drawn && probabilityRan >= drawn) 
           {
             PHEROMONE[moves[k].to] += pheromoneExcretion;
             break;
           }
        }     
     }    

    evaporatePheromone();
   }
   /* FINE ANT COLONY */

   /*for (var i = 0; i < 8; i++) 
     for (var j = 0; j < 8; j++) 
     {
         var quadretto = charSquare(i, j);
         redSquare(quadretto, PHEROMONE[quadretto]); 
         console.log(quadretto + ": " + PHEROMONE[quadretto]); 
     }*/


    var candidate, bestMoveFound, bestMoveProb = 0;


    for (var i = 0; i < shortMoves.length; i++)
    {
      candidate = probabilities[shortMoves[i]];
      if (candidate > bestMoveProb) 
      {
        bestMoveProb = candidate;
        bestMoveFound = shortMoves[i];
      }
    }

    //console.log(probabilities);
    return bestMoveFound;
};


var makeBestMove = function () {
    var bestMove = getBestMove(game);
    game.move(bestMove);
    board.position(game.fen());
    renderMoveHistory(game.history());
    if (game.game_over()) {
        alert('Game over');
    }
};


var positionCount;
var getBestMove = function (game) {
    if (game.game_over()) {
        alert('Game over');
    }

    //var depth = parseInt($('#search-depth').find(':selected').text());

    var d = new Date().getTime();
    var bestMove = AntColony(game);
    var d2 = new Date().getTime();
    var moveTime = (d2 - d);
    //var positionsPerS = ( positionCount * 1000 / moveTime);

    $('#time').text(moveTime/1000 + 's');
    return bestMove;
};

var renderMoveHistory = function (moves) {
    var historyElement = $('#move-history').empty();
    historyElement.empty();
    for (var i = 0; i < moves.length; i = i + 2) {
        historyElement.append('<span>' + moves[i] + ' ' + ( moves[i + 1] ? moves[i + 1] : ' ') + '</span><br>')
    }
    historyElement.scrollTop(historyElement[0].scrollHeight);

};

var onDrop = function (source, target) {

    var move = game.move({
        from: source,
        to: target,
        promotion: 'q'
    });

    removeGreySquares();
    if (move === null) {
        return 'snapback';
    }

    renderMoveHistory(game.history());
};

var onSnapEnd = function () {
    board.position(game.fen());
    btnRun.disabled = false;
};

var onMouseoverSquare = function(square, piece) {
    var moves = game.moves({
        square: square,
        verbose: true
    });

    if (moves.length === 0) return;

    greySquare(square);

    for (var i = 0; i < moves.length; i++) {
        greySquare(moves[i].to);
    }
};

var onMouseoutSquare = function(square, piece) {
    removeGreySquares();
};

var removeGreySquares = function() {
    $('#board .square-55d63').css('background', '');
};

var greySquare = function(square) {
    var squareEl = $('#board .square-' + square);

    var background = '#a9a9a9';
    if (squareEl.hasClass('black-3c85d') === true) {
        background = '#696969';
    }

    squareEl.css('background', background);
};

var cfg = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onMouseoutSquare: onMouseoutSquare,
    onMouseoverSquare: onMouseoverSquare,
    onSnapEnd: onSnapEnd
};


board = ChessBoard(document.getElementById('board'), cfg);

const btnRun = document.getElementById('btnRun');

btnRun.addEventListener('click', (e) => {
  e.preventDefault();

  // Get Values from inputs
  pheromoneInfluence = parseFloat(document.getElementById('alpha').value);
  attractivenessInfluence = parseFloat(document.getElementById('beta').value);
  pheromoneInitial = parseFloat(document.getElementById('tauzero').value);
  evaporationCoefficient = parseFloat(document.getElementById('ro').value);
  pheromoneExcretion = parseFloat(document.getElementById('q').value);
  Generations = parseFloat(document.getElementById('g').value);

  // Execute
  makeBestMove();
  btnRun.disabled = true;
  console.log(PHEROMONE);
});







