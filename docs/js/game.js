var host = ""//"/dino-run-and-jump/";
var game;

function setSettingsPhaser(){     
    var sceneGame = {
        key: 'sceneGame',
        preload: preloadGame,
        create: createGame,
        update: updateGame,
    };

    var sceneLeaderboard = {
        key: 'sceneLeaderboard',
        preload: preloadLeaderboard,
        create: createLeaderboard,
        update: updateLeaderboard
    };

    var config = {
        type: Phaser.auto,
        width: window.innerWidth,
        height: window.innerHeight,


        scene: [sceneGame, sceneLeaderboard],

        scale: {
            autoCenter: Phaser.Scale.CENTER_BOTH,
        },

        physics: {
            default: 'arcade',
            arcade: {
                gravity: {
                    y: 3000
                },
                debug: true
            }
        },

        parent: "gameDiv",

        dom: {
            createContainer: true
        },

        //backgroundColor: 0xDDDDDD
        backgroundColor: 0xFFFFFF,
    };
    game = new Phaser.Game(config);
}

//dichiarazione costanti ecc

const NUM_DINI = 4;
const NUM_TERRENI = 2;
const NUM_MONTAGNE = 2;
const NUM_CACTUS = 5;

var terreni = new Array(NUM_TERRENI);

var montagne = new Array(NUM_MONTAGNE);

var nuvola;

var dini = new Array(NUM_DINI);

var cactus = new Array(NUM_DINI);
for(var i = 0; i< cactus.length; i++){
    cactus[i] = new Array(NUM_CACTUS);
}

var lineCollide = new Array(NUM_DINI);

var distanzaMinima = 130;

//var keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);


//funzione preloadGame, carica gli assets per poi usarli nella scena gioco
function preloadGame() {
    this.load.image('terreno', host + 'img/terreno2.png');
    this.load.image('montagne', host + 'img/montagne2.png');
    this.load.image('nuvola', host + 'img/Nuvola.png');
    this.load.image('cactus', host + 'img/Cactus.png');
    this.load.spritesheet('dinoSprite', host + 'img/dinoSprite.png', {
        frameWidth: 50,
        frameHeight: 52
    });
}

function setTerreni(){
    var counter = 0;
    for(var i = 0; i< terreni.length; i++){
        terreni[i] = this.physics.add.image(counter, 350, 'terreno').setOrigin(0, 0);
        terreni[i].setImmovable(true); //fissa i terreni
        terreni[i].body.allowGravity = false; // toglie la gravità
        counter += 2000;
    }
}

function setMontagne(){
    counter = 0;
    for(var i = 0; i<montagne.length; i++){
        montagne[i] = this.physics.add.image(counter, 275, 'montagne').setOrigin(0, 0);
        montagne[i].setImmovable(true); //fissa le montagne
        montagne[i].body.allowGravity = false; // toglie la gravità
        counter += 2000;
    }
}

function setNuvola(){
    nuvola = this.add.image(1200, 255, 'nuvola').setOrigin(0, 0);
}

function setCactus(){
    var counter = 700;
    var counter2 = 390;
    for(var i = 0; i<cactus.length; i++){
        for(var j = 0; j<cactus[i].length; j++){
            cactus[i][j] = this.physics.add.image(counter, counter2, 'cactus').setOrigin(0, 0);
            console.log("cactus: " + cactus[i][j].y);
        }
        counter +=20;
        counter2 -= 20;
    }

    setCactusPosition();

    for(var i = 0; i<cactus.length; i++){
        for(var j = 0; j<cactus[i].length; j++){
            cactus[i][j].setImmovable(true);
            cactus[i][j].body.allowGravity = false;
        }
    }
}

function setCactusPosition() {

    for(var i = 0; i< cactus.length; i++){
        for(var j = 1; j< cactus[i].length; j++){
            var distanza = Math.floor(Math.random() * 200) + 70;
            if(i == 0){
                cactus[i][j].x = (cactus[i][j-1]).x + distanzaMinima + distanza;
            }else{
                cactus[i][j].x = cactus[i-1][j].x + 20;
            }
            

        }
    }
}

function setDini(){
    counter = 240;
    counter2 = 388;
    var counter3 = 410;
    graphics = this.add.graphics({ lineStyle: { width: 4, color: 0xaa00aa } });
    for(var i = 0; i< dini.length; i++){
        dini[i] = this.physics.add.sprite(counter, counter2, 'dinoSprite').setOrigin(0, 0);
        dini[i].setTintFill(realNumberDino4, realNumberDino4, realNumberDino4, realNumberDino4);
        dini[i].setCollideWorldBounds(true); //collisioni del dino con i bordi
        lineCollide[i] = new Phaser.Geom.Line(0, counter3,  window.innerWidth, counter3); //collider tra dino e line per non farlo cadere
        dini[i].body.setBoundsRectangle(lineCollide[i]);
        graphics.strokeLineShape(lineCollide[i]);
        console.log("line: " + lineCollide[i].y + " " + counter3);
        dini[i].play("run");
        counter -= 20;
        counter2 += 10;
        counter3 += 20;
    }
}

function setAnimations(){
    //animazione di corsa
    this.anims.create({
        key: 'run',
        frames: this.anims.generateFrameNumbers('dinoSprite', {
            start: 0,
            end: 1
        }),
        frameRate: 10,
        repeat: -1
    });

    //animazione di salto
    this.anims.create({
        key: 'jump',
        frames: this.anims.generateFrameNumbers('dinoSprite', {
            start: 2,
            end: 2
        }),
        frameRate: 10,
        repeat: -1
    });

    //animazione di morte
    this.anims.create({
        key: 'death',
        frames: this.anims.generateFrameNumbers('dinoSprite', {
            start: 3,
            end: 3
        }),
        frameRate: 10,
        repeat: -1
    });
}
function collideCactus(dino, cactus) {
    dino.setVelocityX(-150);
    dino.play("death");    
    console.log('collision: '+dino.y+' vs '+cactus.y);

}
function setColliderCactusDini(){
    var collisionGroups = new Array(NUM_DINI);
    for(var i = 0; i<collisionGroups.length; i++){
        collisionGroups[i] = this.physics.add.group();
    }

    for (var i = 0; i < dini.length; i++) {
        for (var j = 0; j < cactus[i].length; j++) {
            collisionGroups[i].add(cactus[i][j]);
        }
        this.physics.add.collider(dini[i], collisionGroups[i], collideCactus, null, this);
        //this.physics.add.collider(collisionGroups[i], lineCollide[i]);
        //this.physics.add.collider(lineCollide[i],collisionGroups[i] );
    }
    /*
    for (var i = 0; i < dini.length; i++) {
        for (var j = 0; j < cactus[i].length; j++) {
            this.physics.add.collider(dini[i], cactus[i][j], collideCactus, null, this);
            //this.physics.add.overlap(dini[i], cactus[i][j], collideCactus(i), null, this);
        }
    }*/
}

//funzione createGame, crea nel canvas tutti i vari assets caricati nella funzione preload game
function createGame() { 
    setTerreni();
    setMontagne();
    setNuvola()
    setCactus();
    setAnimations();
    setDini();
    setColliderCactusDini();
    
}


//funzione per le posizioni dei cactus inizio gioco


//evitare doppio salto
var touchFloor = new Array(NUM_DINI);
for (var i = 0; i < touchFloor.length; i++) {
    touchFloor[i] = true;
}

//variabili di supporto per velocità e assegnazione punteggio
//velocità sfondo
var velocitaSfondo = 5;
var punteggio = new Array(NUM_DINI);
for(var i = 0; i<punteggio.length; i++){
    punteggio[i] = 0;
}
var pAssegnati = new Array(NUM_DINI);
for(var i = 0; i< pAssegnati.length; i++){
    pAssegnati[i] = new Array(5);
}

for(var i = 0; i<pAssegnati.length; i++){
    for(var j = 0; j<pAssegnati[i].length; j++){
        pAssegnati[i][j] = false;
    }
}

//var supporto per cambio difficoltà
var supVelocita = new Array(5);
for (var i = 0; i < supVelocita.length; i++) {
    supVelocita[i] = true;
}


function updateTerreni(){
    //terreni si spostano
    for (var i = 0; i < terreni.length; i++) {
        terreni[i].x -= velocitaSfondo;
    }

    //se escono completamente dal canvas vengono ridisegnati infondo
    for (var i = 0; i < terreni.length; i++) {
        if (terreni[i].x < -2000) {
            terreni[i].x = 1100;
        }
    }
}
function updateMontagne(){
    //montagne si spostano
    for (var i = 0; i < montagne.length; i++) {
        montagne[i].x -= 1;
    }


    //se escono completamente dal canvas vengono ridisegnati infondo
    for (var i = 0; i < montagne.length; i++) {
        if (montagne[i].x < -2000) {
            montagne[i].x = 2000;
        }
    }
}
function updateCactus(){
    //cactus si spostano

    for(var i = 0; i<cactus.length; i++){
        for(var j = 0; j<cactus[i].length; j++){
            cactus[i][j].x -= velocitaSfondo;
        }
    }

    //cacactus1Dino1 riposizionamento

    for(var i = 0; i<cactus.length; i++){
        for(var j = 0; j<cactus[i].length; j++){
            if(cactus[i][j].x < -26){
                if(i == 0){
                    var num = 0;
                    if(j == 0){
                        num = cactus[i].length -1;
                    }else{
                        num = j-1;
                    }
                    cactus[i][j].x = cactus[i][num].x + distanzaMinima + Math.floor(Math.random() * 200) + 70;
                }else{
                    cactus[i][j].x = cactus[i-1][j].x + 20;
                }
                pAssegnati[i][j] = false;
            }
        }
    }

}
function updateNuvola(){
    //movimento nuvola
    nuvola.x -= 3;

    //nuvola random
    if (nuvola.x < -97) {
        nuvola.x = Math.floor(Math.random() * 2000) + 900;
    }
}


//funzione updateGame, viene richiamata 60 volte al secondo, utilizzata per i movimenti nel animazione
function updateGame() {
    
    updateTerreni();
    updateMontagne();
    UpdateCactus();
    updateNuvola();
   
    //input salto
    if (keySpace.isDown) {
        for(var i = 0; i<dini.length; i++){
            if (touchFloor[i]) {
                //salto
                dini[i].play("jump");
                dini[i].setVelocityY(-800);
                touchFloor[i] = false;
            }
        }
        
    }

    

    //collisione con il suolo per evitare il doppio salto
    for(var i = 0; i<dini.length; i++){
        if (dini[i].y == lineCollide[i].y1 - dini[i].height && touchFloor[i] == false) {
            touchFloor[i] = true;
            dini[i].play("run");
        }
    }
    
    //velocità & punteggioDini  
    for(var i = 0; i<dini.length; i++){
        for(var j = 0; j<cactus[i].length; j++){
            if (dini[i].x > cactus[i][j].x + 26 && !pAssegnati[i][j]) {
                punteggio[i]++;
                pAssegnati[i][j] = true;
            }
        }
    }
    

    //difficolta
    var count = 4;
    for(var i = 0; i<5 ; i++){ 
        var check = false;
        for(var j = 0; j<dini.length; j++){
            if(!check){
                check = check || (punteggio[j] > count && supVelocita[i]);
            }else{
                break;
            }
        }
        if(check){
            velocitaSfondo += 1;
            supVelocita[i] = false;
            distanzaMinima += 30; // 0 -> 30 / 1 -> 30 / 2 -> 20 / 3 -> 0 / 4 -> 0 
        }
        check++;

    }
    var check = true;
    for(var i = 0; i< dini.length; i++){
        check = check && dini[i].x < -50;
    }

    if (check) {
        //endOfTheGame(this);
    }



}



//collisione tra dinosauri e cactus
//function collideCactus(num) {



function endOfTheGame(game) {
    game.input.stopPropagation();
    game.scene.switch('sceneLeaderboard');
}


//scena leaderboard

function preloadLeaderboard() {}

var line3;

function createLeaderboard() {
    graphics = this.add.graphics({
        lineStyle: {
            width: 4,
            color: 0xaa00aa
        }
    });
    line3 = new Phaser.Geom.Line(0, 80, 700, 80);

    var style = {
        font: "bold 32px Arial",
        fill: "#000",
        boundsAlignH: "center",
        boundsAlignV: "middle"
    };
    this.add.text(250, 25, "Leaderboard", style).setOrigin(0, 0);
}

function updateLeaderboard() {
    graphics.strokeLineShape(line3);
}