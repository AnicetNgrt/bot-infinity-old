var gameCard = class {
    constructor(a){
        this.reference = a;
        this.playcount = 0;
        this.turnPlayCount = 0;
        this.effective = false;
        this.turnEffCount = 0;
        this.usedInRaw = function (game) {
            var inraw = 0;
            for(var i = game.playHistory.length-2;i>=0;i-=2) {
                if(game.playHistory[i].indexOf(this.reference)!=-1) inraw+=1;
            }
            return inraw;
        }
    }
}

var zugzwangGame = class {
    constructor (a,b,c,d,e,f,g,h,i,j,k,l,m,n,) {
        this.cards = [
            {
                name:"Bonnet d'Âne",
                description:"Jouez cette carte face cachée. La prochaine fois que l'adversaire déplacera un de ses pions à côté d'un des votres, votre pion en question sera placé dans un coin de votre choix.",
                weigth: 1,turnLim: 1,gameLim: 2,public: false,effectDuration: 10,
                effect: function(p,e,c){
                    c.turnEffCount += 1;
                    if(c.turnEffCount == 1) {
                        c.playCount += 1; 
                    }
                    
                },
                
            }
        ];
        this.players = [
            {
                pawns: [{x:a,y:b,in:true,alive:true},{x:c,y:d,in:true,alive:true},{x:e,y:f,in:true,alive:true}],
                hand: m,
                cards: [],
                actions: 4
            },
            {
                pawns: [{x:g,y:h,in:true,alive:true},{x:i,y:j,in:true,alive:true},{x:k,y:l,in:true,alive:true}],
                hand: n,
                cards: [],
                actions: 4
            }
        ];
        
        this.players.forEach(player=>{
            for(var i=0;i<player.hand.length;i++){
                player.cards.push(new gameCard(player.hand[i]));
            }
            console.log(player.cards);
        });
        
        this.playHistory = [];

        this.checkWin = function (t) {
            aliveCount = 0;
            player = this.players[t];
            player.pawns.forEach(pawn=>{
                if(pawn.alive==true) aliveCount++;
            });
            if(aliveCount==0) return true;
            if(aliveCount!=0) return false;  
        }

        this.checkAttack = function (t) {
            attacks=[];
            this.players[t].pawns.forEach(ap=>{
                this.players[(t+1)%2].pawns.forEach(ep=>{
                    if((Math.abs(ap.x-ep.x)+Math.abs(ap.y-ep.y)==1)) {
                        attacks.push([ap,ep]);
                    }
                });
            });
        }

        this.playCard = function (t,cardIndex) {
            var hand = this.players[t].hand;
            if(hand.indexOf(this.cards[cardIndex]==-1)) return console.log("Don't have this card");
            
            var cards = this.players[t].cards;
            var card = cards.find(c=>c.reference==cardIndex);
            var cRules = hand.find(r=>r==cardIndex);

            if(!card) return console.log("Can't find this card");
            if(card.turnEffCount > cRules.effectDuration) return;
            
        }
    }
}


async function match(p1,p2) {
    var game = new zugzwangGame(1,2,3,4,5,6,7,8,9,10,11,12,[0,0],[0,0]);
    console.log(game);
    console.log("Que le match commence");

}

match(1,2);