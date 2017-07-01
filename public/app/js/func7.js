'use strict';

function func7(){

//let path1js=__dirname;
//Дата и время
let now = new Date();         
let god = now.getFullYear();
let mes = now.getMonth()+1;
let den = now.getDate();

//***************************************************************************************************************************************************************** */
// проверка существования json за неделю
let mas_maxpr=[]        //массив с максимальными ценами
let mas_avgpr=[]        //массив с максимальными ценами
let mas_minpr=[]        //массив с максимальными ценами


      for (let i=0; i<7; i++){
            now.setDate(now.getDate()-1);
            //console.log(now);
            god = now.getFullYear();
            mes = now.getMonth()+1;
            den = now.getDate();
            let d2 = god+'-'+mes+'-'+den;
            

            //let pathjson=ch2+'public\\json\\cian\\'+god+'\\'+mes+'\\'+den+'\\'+'lite2\\'+'33-1-lite.json';
            let pathjson = '/json/myfile.json';

            //async calls
            $.get(pathjson)
            .then(function(data){
                  mas_maxpr[i]=data[0].maxpr;
                  mas_avgpr[i]=data[0].avgpr;
                  mas_minpr[i]=data[0].minpr;
                  if ((mas_maxpr.length==7) && (mas_avgpr.length==7) && (mas_minpr.length==7)){
                        alert(mas_maxpr[6]+', '+mas_avgpr[6]+', '+mas_minpr[6]);

                  }
            });      
      
      };
} 
