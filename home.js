document.querySelector('#hit_button').addEventListener('click',func_hitButton);
document.querySelector('#stand_button').addEventListener('click',func_standButton);
document.querySelector('#deal_button').addEventListener('click',func_dealButton);

var obj = {
    'cardInitial':['2','3','4','5','6','7','8','9','10','A','J','Q','K'],
    'cardsValue':{'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'10':10,'A':10,'J':[1,11],'Q':10,'K':10,},
    'yours':{'id':'#your_sideOfTable','score':0 ,'dispBoard':'#your_result'},
    'its':{'id':'#its_sideOfTable','score':0,'dispBoard':'#its_result'},
    'winsT':0,
    'lossesT':0,
    'drawT':0,
    'access_stand':false,
    'access_hit':true,
    'access_deal':false,

    'darkORlight':1,
}
// if bot busts ,when bot stops throwing more cards only in these 2 scenarios call function which computes the winner ,deal is for clearing up space for next match
function func_hitButton(){
    if(obj['access_hit']){
        if(obj['yours']['score']<=21){
            var num = func_bringCardAndEffects(obj['yours']);
            func_calcValueOfCards_andDisp(num,obj['yours']['dispBoard'],obj['yours']);
        
            // if(obj['yours']['score']>21){
            //     var winner= func_computeTheWinner();
            // }//logic not giving justice
            if(obj['yours']['score']>21){
                func_bustLogic(obj['yours']);
            }
        }
        obj['access_stand']=true;
    }
}
async function func_standButton(){
    if(obj['access_stand']){
        if(obj['its']['score']<=21){
            while(obj['its']['score']<16){
                var num = func_bringCardAndEffects(obj['its']);
                func_calcValueOfCards_andDisp(num,obj['its']['dispBoard'],obj['its']);
                await sleepInducer(500);
    
                if(obj['its']['score']>=16){
                    var winner= func_computeTheWinner();
                    func_dispWinner(winner);
                }
            }
            if(obj['its']['score']>21){
                func_bustLogic(obj['its']);
            }
                                                                                // console.log(winner+' working');
            func_scoreTable(winner);
        }
        obj['access_hit']=false;
        obj['access_deal']= true;
    }
}
function func_dealButton(){
    if(obj['access_deal']){
        func_cleanUpMess();
        obj['its']['score']=0;
        obj['yours']['score']=0;

        obj['access_hit']=true;
        obj['access_stand']=false;
        obj['access_deal']= false;
    }
}
function func_bringCardAndEffects(pathsTO){
    var cardno = Math.floor(Math.random()*13);
    console.log(cardno);

    func_bringCard_ToDisp(obj['cardInitial'][cardno],pathsTO);
    var swish= new Audio('assets/audio/swish.mp3');
    swish.play();
    return obj['cardInitial'][cardno];
}
function func_bringCard_ToDisp(cardno,pathsTO){
    console.log(cardno);
    var imgOfCard = document.createElement('img');
    imgOfCard.src= `assets/img/${cardno}.png`;
    document.querySelector(pathsTO['id']).appendChild(imgOfCard);
}

function func_calcValueOfCards_andDisp(num,disp_Board,pathToScore){
    if(num === 'J'){
        if(pathToScore['score']+obj['cardsValue'][num][1]<=21){
            pathToScore['score'] +=obj['cardsValue'][num][1];
        }
        else{
            pathToScore['score'] +=obj['cardsValue'][num][0];
        }
    }
    else{
        pathToScore['score'] +=obj['cardsValue'][num];
    }
    console.log("current sum: "+ pathToScore['score']);
    document.querySelector(disp_Board).textContent= pathToScore['score'];
}
/* // This will not work as you thought previously
if(obj['yours']['score']>21 || obj['its']['score'] >21){
    console.log('bsdk');
}
*/
function func_computeTheWinner(){
    console.log('i will compute the winner for you');//
    if(obj['yours']['score']<=21){
        if(obj['its']['score']>21){
            winner= 'ME';
            var cash = new Audio('assets/audio/cash.mp3');
            cash.play();
        }
        else if(obj['yours']['score'] < obj['its']['score']){
            winner= 'BOT';
            var aww = new Audio('assets/audio/aww.mp3');
            aww.play();
        }
        else if(obj['yours']['score'] > obj['its']['score']){
            winner= 'ME';
            var cash = new Audio('assets/audio/cash.mp3');
            cash.play();
        }
        else if(obj['yours']['score'] == obj['its']['score']){
            winner= 'DRAW';
            var draw= new Audio('assets/audio/Sweet.ogg');
            draw.play();
        }
    }
    else{
        if(obj['its']['score']>21){
            winner= 'DRAW';
            var draw= new Audio('assets/audio/Sweet.ogg');
            draw.play();
        }
        else{
            winner= 'BOT';
            var aww= new Audio('assets/audio/aww.mp3');
            aww.play();
        }
    }
    return winner;
}
function func_dispWinner(){
    console.log(winner);
    if(winner == 'BOT'){
        var wins= 'Bot won!';
        var colorDisp = 'red';
    }
    else if(winner =='ME'){
        var wins= 'You won!';
        var colorDisp = 'seagreen';
    }
    else if(winner == 'DRAW'){
        var wins= 'draw mon ami!';
        var colorDisp = 'yellow';  
    }
    document.querySelector('#disp_scr').textContent = wins;
    document.querySelector('#disp_scr').style.color = colorDisp;
}
function sleepInducer(ms){
    return new Promise(resolve => setTimeout(resolve,ms));
}

function func_bustLogic(pathTodispBrd){
    document.querySelector(pathTodispBrd['dispBoard']).textContent='BUSTED!';
    document.querySelector(pathTodispBrd['dispBoard']).style.color='red';
}
function func_cleanUpMess(){
// clearing up cards from table
    var i =document.querySelectorAll('img');                                          // 'i' is an array (arr)
                // console.log(i);
                // console.log(i.length);
        // DOING IT WITH 'FOR LOOP' LATER DID WITH 'WHILE LOOP' JUST BELOW SO COMMENTING THIS DOWN
    for(let j = 0 ; j<i.length ; j++){
        i[j].remove();
    }
                //    console.log(i.length!=0);
/*  also did with while loop
    var j= i.length -1;
    while(i.length!=0){
        i[j].remove();
        j--;
    }
*/
// clearing up status of win or loss or draw mon ami!
    document.querySelector('#disp_scr').textContent= "Let's play";
    document.querySelector('#disp_scr').style.color = 'black';

// clearing off You:18 and Dealer:16
    document.querySelector(obj['yours']['dispBoard']).textContent= 0;
    document.querySelector(obj['its']['dispBoard']).textContent= 0;
    
    document.querySelector(obj['yours']['dispBoard']).style.color= 'white';
    document.querySelector(obj['its']['dispBoard']).style.color= 'white';
}

function func_scoreTable(winner){     // here i discovered that in here you have to increment first and then ask for it not like         document.querySelector('#winsID').textContent=obj['winsT']++;  this will put 0 there, not 1 so first increment then ask for it
    if(winner== 'ME'){
        obj['winsT']++;
        document.querySelector('#winsID').textContent=obj['winsT'];
    }
    else if(winner== 'BOT'){
        obj['lossesT']++;
        document.querySelector('#lossesID').textContent=obj['lossesT'];
    }
    else{
        obj['drawT']++;
        document.querySelector('#drawID').textContent =obj['drawT'];
    }
}
// DARK MODE
document.querySelector('#drk').addEventListener('click',func_darkMode);
function func_darkMode(){
    if(obj['darkORlight']%2!==0){
        // dark appearance
        document.querySelector('body').style.color='#e3dbd5';
        document.querySelector('body').style.backgroundColor='black';

        // introducing changes to button
        document.querySelector('#drk').style.backgroundColor='seagreen';
        document.querySelector('#drk').style.color='#e3dbd5';
        document.querySelector('#drk').textContent='light mode';

        obj['darkORlight']++;
    }
    else{
        //light appearance
        document.querySelector('body').style.color='black';
        document.querySelector('body').style.backgroundColor='#e3dbd5';

        // introducing changes to button
        document.querySelector('#drk').style.backgroundColor='indianred';
        document.querySelector('#drk').style.color='#e3dbd5';
        document.querySelector('#drk').textContent='dark mode';

        obj['darkORlight']++;
    }
}

// NOTES::::>>>>
// to practise around
// async await func()
// and learned these too...
// learned to create global variables so that they can be accessed from anywhere without return it from another func. like 'score'
// here i discovered that in here you have to increment first and then ask for it not like         document.querySelector('#winsID').textContent=obj['winsT']++;  this will put 0 there, not 1 so first increment then ask for it