//import modules
const prompt = require('prompt-sync')({sigint: true});
const clear = require('clear-screen');
 
//declare variables
const hat = '^';
const hole = 'O';
const grass = '░';
const character = '*';
const row = 10;
const col = 10;

//create field
class Field {

    field = [];
    constructor() {
        //set position of character to top left at start of every game
        this.characterX = 0;
        this.characterY = 0;

        //create empty rows
        for (let x = 0; x < row; x++) {
            this.field[x] = [];
        }

        this.generateField(); //to fill the field with grass and holes
    }

    generateField() {
        //create columns in rows and fill them up with grass
        for(let x = 0; x < col; x++) {
            for(let y = 0; y < row; y++) {
                this.field[y][x] = grass;
            }
        }

        //spawn character in top left
        this.field[this.characterY][this.characterX] = character;

        //random hat position until it is not at [0][0]
        let hatX = 0;
        let hatY = 0;
        do {
            hatX = Math.floor(Math.random() * col);
            hatY = Math.floor(Math.random() * row);
        }
        while(hatX == 0 && hatY == 0);

        //spawn hat after getting random position
        this.field[hatY][hatX]=hat;

        //create hole in random position
        const randomHole = ((holeX, holeY) => {
            holeX = Math.floor(Math.random() * col);
            holeY = Math.floor(Math.random() * row);

            //hole cannot be [0][0] and cannot be existing hole or hat
            if ((holeX == 0 && holeY == 0)||(this.field[holeY][holeX]==hole || this.field[holeY][holeX]==hat)){
                randomHole();
            }
            else {
                this.field[holeY][holeX] = hole;
            }
        });

        //randomly assign 23 holes
        for(let noOfHoles = 0; noOfHoles < 23; noOfHoles++) {
            randomHole();
        }
    }

    print() {
        clear();
        const displayString = this.field.map(row => {
            return row.join(''); //removes ', ' in the columns and return as string
        }).join('\n'); //removes ', ' in the rows and breaks each row into new line
        console.log(displayString); //display the grass as a whole field
    }

    gameDialog() {
        //game dialog and user input response
        const answer = prompt('Which way? '.toUpperCase());

        //check the current state of the character
        const stateCheck = () =>{
            let charPos = this.field[this.characterY][this.characterX];
            if ((this.characterX < 0 || this.characterX >= col)||(this.characterY < 0 || this.characterY >= row)){
                //print so that character will disappear from map
                this.print();
                console.log('Game Over, you are out of bounds');
            }
            else if (charPos == hat){
                //overlap the hat with character
                this.field[this.characterY][this.characterX]=character;
                this.print();
                console.log("Hooray, you've found your hat!");
            }
            else if (charPos == hole){
                //change the character into a hole
                this.field[this.characterY][this.characterX]=hole;
                this.print();
                console.log('Game Over, you fell into a hole :(');
            }
            else {
                this.field[this.characterY][this.characterX]=character;
                this.print();
                this.gameDialog();
            }
        }

        //up
        if (answer == "w"){
            this.field[this.characterY][this.characterX]=grass;
            this.characterY = this.characterY - 1;
            stateCheck();
        }
        //down
        else if (answer == "s"){
            this.field[this.characterY][this.characterX]=grass;
            this.characterY = this.characterY + 1;
            stateCheck();
        }
        //left
        else if (answer == "a"){
            this.field[this.characterY][this.characterX]=grass;
            this.characterX = this.characterX - 1;
            stateCheck();
        }
        //right
        else if (answer == "d"){
            this.field[this.characterY][this.characterX]=grass;
            this.characterX = this.characterX + 1;
            stateCheck();
        }
        //quit
        else if (answer == "q"){
            clear();
            console.log('You have quit the game');
        }
        //wrong key
        else{
            console.log('Please use "w", "a", "s" or "d" to move');
            this.gameDialog();
        }
    }

    //print the field and start the game dialog
    runGame() {
        this.print();
        this.gameDialog();
    }

} //end of field

const myField = new Field(); //create an instance object of a field
myField.runGame(); //run and display as a game