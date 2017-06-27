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
let avg_maxpr=[]        //массив с максимальными ценами
let min_maxpr=[]        //массив с максимальными ценами

for (let i=0; i<1; i++){
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
            avg_maxpr[i]=data[0].avgpr;
            min_maxpr[i]=data[0].minpr;
      });      
};

//console.log(obj[0].avgpr);

/*
      


//}
/*now = new Date();
god = now.getFullYear();
mes = now.getMonth();
den = now.getDate()-1;
let d2=god+'-'+mes+'-'+den;
//console.log(d2);
d2 = new Date(god,mes,den);
console.log(d2);
//alert(d2);
let d3=[];
d3[0]=d2;
for (let i=0; i<7; i++){

      d3[i]=d2.setUTCDate(den - i);
      let god2=d2.getFullYear();
      let mes2=d2.getMonth();
      let den2=d2.getDate();
      d3[i]=god2+'-'+mes2+'-'+den2;
}
//alert(d2);
console.log(d3);
/*for (let i=0; i<d3.length; i++){
      let tmpdate=split('-',3);
      let tmpy=tmpdate[0];
      let tmpm=tmpdate[1];
      let tmpd=tmpdate[2];
      let filename= tmpy+'-'+tmpm+'-'+tmpd;
}


*/
}
