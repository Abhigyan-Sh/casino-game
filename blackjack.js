// NOTES: features which have been added later as more fun and creative efforts have a "*" mark
// var playerName = prompt("enter your name");//1*
document.querySelector("#blackjack-Hit-button").addEventListener("click",func_OnbothSides);
document.querySelector("#blackjack-Stand-button").addEventListener("click",func_dealerSides);
var obj={
    'cards':['2','3','4','5','6','7','8','9','10','A','J','K','Q'],
    'result':{'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'10':10,'A':[1,11],'J':10,'K':10,'Q':10},
    'you':{'box':'#your-box','resId':'#your-blackjack-result','score':0},
    'dealer':{'box':'#dealer-box','resId':'#dealer-blackjack-result','score':0},
    'wins':0,
    'loses':0,
    'draws':0,
    'access_Stand':false,
    'access_deal':false,
    // 'deny_Hit':true,               // declaring it here won't make function later to recognize this though access_deal and access_Stand can be recognized because they also have been given value 'true' by other function.
}
var already = true;
var deny_Hit = true;

// document.querySelector('#you').textContent= playerName +': ';//2*

var youPath = obj['you'];
var compPath = obj['dealer'];

function func_OnbothSides(){
    if(deny_Hit){
        func_selectCards(youPath);
        access_Stand = true;
    }
    // func_selectCards(compPath);                                                             // edited here
}

function func_dealerSides(){
    if(youPath['score']>21){
        access_Stand=false;
    }
    if(access_Stand){
        func_selectCards(compPath);

        access_deal = true;
        deny_Hit = false;
    }
}
// below is the code which turns 2nd player into a "BOT"
async function func_selectCards(activePlayer){
//console.log(activePlayer=== youPath);//this gives true/false
    if(activePlayer===youPath){
        func_selectCardsfurther(activePlayer);
    }
    else{
        while(compPath['score']<16){
            func_selectCardsfurther(activePlayer);
            await sleepInducer(500);
        }
    }
}
function func_selectCardsfurther(activePlayer){
    var card_num =Math.floor(Math.random()*13);
    // console.log(card_num);
    // 
    if(activePlayer['score']<=21){                                                        // original statement
    // if(youPath['score']<=21 && compPath['score']<=21){
        func_showResult(activePlayer,obj.cards[card_num]);
    // 
        func_showCards(obj.cards[card_num],activePlayer);
    // 
        func_dispResult(activePlayer);
    // 
        if(compPath['score']>15){
           let winner = func_the_winner();
           func_dispWinner(winner);
           already = false;
        }
        // added later 
        if(youPath['score']>21){
            let winner = func_the_winner();
            func_dispWinner(winner);
            already = false;
        }
    }
}
function sleepInducer(ms){                                                              //something really new
    return new Promise(resolve => setTimeout(resolve,ms));
}
function func_showCards(cardfile,activePlayer){
    var card_image = document.createElement('img');
    card_image.src = `${cardfile}.png`;
    document.querySelector(activePlayer['box']).appendChild(card_image);
    const swish = new Audio("swish.mp3");
    swish.play();
}

document.querySelector("#blackjack-Deal-button").addEventListener("click",function(){
    if(youPath['score']>21){access_deal= true;}
    if(access_deal){
        if(already){
            let winner = func_the_winner();
            func_dispWinner(winner);
        }
        var imgArr1= document.querySelector("#your-box").querySelectorAll("img");
        var imgArr2= document.querySelector("#dealer-box").querySelectorAll("img");
        for(let i = 0 ; i<imgArr1.length;i++){
            imgArr1[i].remove();
        }
        for(let i = 0 ; i<imgArr2.length;i++){
            imgArr2[i].remove();
        }
        youPath['score'] = 0;
        compPath['score'] = 0;
        console.log(youPath['score']);
    
        // document.querySelector(activePlayer['resId']).textContent = 0;            // activePlayer is not defined
        document.querySelector('#your-blackjack-result').textContent = 0;
        document.querySelector('#your-blackjack-result').style.color= 'white';
        document.querySelector('#dealer-blackjack-result').textContent = 0;
        document.querySelector('#dealer-blackjack-result').style.color= 'white';
    
        document.querySelector('#blackjack-conclusion').textContent= "Let's play";
        document.querySelector('#blackjack-conclusion').style.color= 'white';
        // console.clear();                                                              // can clear this if wish
        already= true;
        deny_Hit = true;
        access_Stand=false;
        access_deal= false;
    }
});
function func_showResult(activePlayer,cardno){
    if(cardno == 'A'){
        if(activePlayer['score']+obj['result'][cardno][1]<=21){
            activePlayer['score'] += obj['result'][cardno][1];
        }
        else{
            activePlayer['score'] += obj['result'][cardno][0];
        }
    }
    else{
        activePlayer['score'] += obj['result'][cardno];
        console.log(activePlayer['score']);
    }
}
function func_dispResult(activePlayer){
    document.querySelector(activePlayer['resId']).textContent = activePlayer['score'];
    
    if(activePlayer['score']>21){
        document.querySelector(activePlayer['resId']).textContent = 'BUSTED';
        document.querySelector(activePlayer['resId']).style.color= 'red';
    }
}
// ^_^ its happening
function func_the_winner(){
    let winner;
    if(youPath['score']<=21){
        console.log(youPath['score']);                              // try and testing
        if(youPath['score']>compPath['score']||compPath['score']>21){
            console.log('You won!');
            winner = youPath;
            obj['wins']++;
        }
        else if(youPath['score']<compPath['score']){
            console.log('bot won!');
            winner = compPath;
            obj['loses']++;
        }
        else if(youPath['score'] == compPath['score']){           // drew ,falls here everytime
            console.log('you drew!');
            obj['draws']++;
        }
    }
    else if(youPath['score']>21 && compPath['score']<=21){
            console.log('bot won!');
            winner = compPath;
            obj['loses']++;
    }
    else if(youPath['score']>21 && compPath['score']>21){           // drew
            console.log('you drew!');
            obj['draws']++;
    }
    return winner;
}
function func_dispWinner(winner){
    let message,messageColor;
    if(winner === youPath){
        message = 'You won!';
        messageColor = 'green';
        const cash = new Audio("cash.mp3");
        cash.play();
        document.querySelector('#wins').textContent = obj['wins'];
    }
    else if(winner === compPath){
        message = 'bot won!';
        messageColor = 'red';
        const aww = new Audio("aww.mp3");
        aww.play();
        document.querySelector('#loses').textContent = obj['loses'];
    }
    else{
        message = 'You tied';
        messageColor = 'yellow'
        document.querySelector('#draws').textContent = obj['draws'];
    }
    document.querySelector('#blackjack-conclusion').textContent = message;
    document.querySelector('#blackjack-conclusion').style.color = messageColor;
}
// 
