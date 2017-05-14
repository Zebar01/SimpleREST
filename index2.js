'use strict';

let request = require('request');
let cheerio = require('cheerio');
let express = require('express');
let fs      = require('fs');

let app = express();
let mkdirp = require('mkdirp');

app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'Super pupper secret string.!.', resave: true, saveUninitialized: true }));

app.use('/api/query', function(req, res){
    /*********************************************************************************************** */
    //создание папки - работает
    //Дата и время
    let now = new Date();         
    let god = now.getFullYear();
    let mes = now.getMonth()+1;
    let den = now.getDate();
    let pathjs =`/public/json/cian/`+god+'/'+mes+'/'+den;       //год-месяц-день
    let path1=__dirname+pathjs;
   
     mkdirp(path1, function (err) {
        if (err) console.error(err)
        else console.log(path1)   //путь к созданной папке в терминале*/
    });
    //129 элементов
let ID_Ray = new Array();
ID_Ray = [1, 125, 126, 127, 128,  129,  130,  131,   132, 5,  23,  24,  25,  26,   27,  28,  29,  30,  31,  32,  33,  34,  35,  36,  37,  38 , 6, 39,  40,  41,  42,  43,  44,  45,  46,   47,  48,  49,  50,  51,   52,  53,   54,  55, 11, 112,  113,  114,  115,  116,  117,  118,   119,  120,  121,  122,   123,  124,  349,  348,  350,   13,  14,  15,  16,  17,  18,  19,  20,  21,  22, 7,  56,  57,   58,  59,  60,  61,  62,  63,  64,  65,  66,  67,  68,   69,   70,  71, 10,  100,  101,  102,  103,  104,  105,  106,   107,   108,  109,   110,  111 ,9,   84,   85,  86,  87,  88,  89,  90,  91,   92,  93,   94,   95,  96,   97,   98,   99, 8,  72,  73,  74,  75,  76,  77,  78,  79,  80,  81,  82,  83]
let idr=0;
//console.log(ID_Ray[idr]);       // обращение к элементу массива, начинается с 0
//
let opt = {
      deal_type:      req.query.deal_type      || 'sale',
      engine_version: req.query.engine_version || 2,
      maxprice:       req.query.maxprice       || 25000000,
      minprice:       req.query.minprice       || 4000000,
      offer_type:     req.query.offer_type     || 'flat',
      region:         req.query.region         || 1,
      query_type:     req.query.query_type     || 'newquery',
      get_app_pages:  req.query.get_all        || false,
      district:       req.query.district       || 24,		//Район Москвы для выборки
                                                                /* ид районов
                                                                СЗАО 1 : Куркино 125, Митино 126, Покровское-Стрешнево 127, Северное Тушино 128, Строгино 129, Хорошево-Мневники 130, Щукино 131, Южное тушино 132
                                                                САО 5 : Аэропорт 23, Беговой 24, Бескудниковский 25, Войковский 26, Восточное Дегунино 27, Головинский 28, Дмитровский 29, Западное Дегунино 30, Коптево 31, Левобережный 32, Молжаниновский 33, Савёловский 34, Сокол 35, Тимирязевский 36, Ховрино 37, Хорошевский 38 
                                                                СВАО 6: Алексеевский 39, Алтуфьевский 40, Бабушкинский 41, Бибирево 42, Бутырский 43, Лианозово 44, Лосиноостровский 45, Марьфино 46, Марьина Роща 47, Останкинский 48, Отрадное 49, Ростокино 50, Свиблово 51, Северное Медведково 52, Северный 53, Южное Медведково 54, Свиблово 55
                                                                ЗАО 11: Внуково 112, Дорогомилово 113, Крылатское 114, Кунцево 115, Можайский 116, Ново-Переделкино 117, Очаково-Матвеевское 118, Проспект Вернадского 119, Раменки 120, Солнцево 121, Тропарёво-Никулино 122, Филёвский парк 123, Фили-Давыдково 124, Конезавод 349, Рублёво-Архангельское 348, Сколково 350
                                                                ЦАО 4: Арбат 13, Басманный 14, Замоскворечье 15, Красносельский 16, Мещанский 17, Пресненский 18. Таганский 19, Тверской 20, Хамовники 21, Якиманка 22
                                                                ВАО 7: Богородское 56, Вешняки 57, Восточное Измайлово 58, Восточный 59, Гольяново 60, Иваноское 61, Измайлово 62, Косино-Ухтомский 63, Метрогородок 64, Новогиреево 65, Новокосино 66, Перово 67, Преображенское 68, Северное Измайлово 69, Соколиная гора 70, Сокольники 71
                                                                ЮЗАО 10: Академический 100, Гагаринский 101, Зюзино 102, Коньково 103, Котловка 104, Ломоносовский 105, Обручевский 106, Северное Бутово 107, Тёплый стан 108, Черёмушки 109, Южное Бутово 110, Ясенево 111
                                                                ЮАО 9: Бирюлёво Восточное 84, Бирюлёво Западное 85, Братеевот 86, Даниловский 87, Донской 88, Зябликово 89, Москворечье-Сабурово 90, Нагатино-Садовники 91. Нагатинский затон 92, Нагорный 93. Орехово-Борисово Северное 94, Орехово-Борисово Южное 95, Царицыно 96, Чертаново Северное 97, Чертаново центральное 98, Чертаново Южное 99
                                                                ЮВАО 8: Выхино-Жулебино 72, Капотня 73, Кузьминки 74, Лефортово 75, Люблино 76, Марьино 77, Некрасовка 78, Нижегородский 79, Печатники 80, Рязанский 81, Текстильщики 82, Южнопортовый 83
                                                                */
     ne1etaj:		req.query.ne1etaj		|| 0,	// не первый этаж
     vtor:			req.query.vtor			|| 1,	//только вторичка
     only_flat:	    req.query.only_flat		|| 1,
     kolkom:         req.query.room         || 1,  //количество комнат
  };

  if (req.query.p)
  {
      opt.p = req.query.p;
  }


  if (req.query.p)
  {
      opt.p = req.query.p;
  }

  if(opt.query_type == 'saved'){
      if(fs.existsSync(__dirname + '/saved.json'))
      {
          let saved = require(__dirname + '/saved.json');
          res.status(200).json(saved);
          return;
      } else {
          res.status(404).send('Saved results not found');
          return;
      }
  }
// формирование url 
let url='';
let komnat=1;
let tekkomjs=0;
  let url2=function(rayon,komnat){
        url = `https://www.cian.ru/cat.php?currency=2&deal_type=${opt.deal_type}`;
     //   url += `&district%5B0%5D=${opt.district}&engine_version=${opt.engine_version}`;
        url += `&district%5B0%5D=`+ID_Ray[idr]+`&engine_version=${opt.engine_version}`;
        url += `&is_first_floor=${opt.ne1etaj}`;	// не первый этаж
        url += `&maxprice=${opt.maxprice}&minprice=${opt.minprice}`;
        url += `&object_type%5B0%5D=${opt.vtor}`; // только вторичка
        url += `&offer_type=${opt.offer_type}`;
        url += `&only_flat=${opt.only_flat}`;
        url += "&repair%5B2%5D=1&repair%5B2%5D=2&repair%5B2%5D=3";		// ремонт, косм - 1, евро - 2, без - 3
        url += komnat == 1 ? '&room1=1': '';
        url += komnat == 2 ? '&room2=1': '';
        url += komnat == 3 ? '&room3=1': '';
        url += "&totime=2592000";			// выборка за месяц
        //console.log(url);
    }


  let stopper = '';
  let kidr=0;
  //url2(1);
  let request_url = function(u, arr, page){
      
      let opts = {  uri: u + `&p=${page}`,
                    headers: {
                        'Pragma': 'no-cache',
                        'Accept-Encoding': 'gzip, deflate, sdch, br',
                        'Accept-Language': 'ru-RU,ru;q=0.8,en-US;q=0.6,en;q=0.4',
                        'Upgrade-Insecure-Requests': '1', 
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36',
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                        'Referer': 'https://www.cian.ru/',
                        'Cookie': '_CIAN_GK=07fc4b80-0c0e-11e7-8817-4671176866ff; anonymous_id=07fc086e-0c0e-11e7-8817-4671176866ff; app_banner_disabled=true; _ym_uid=1489864008474635110; _ym_isad=2; _gat_UA-30374201-2=1; _ad_parallax_checked=1489864044891; _ad_stretch_checked=1489864044931; _ad_branding_checked=1489864044933; _ad_mobile_native_listing_checked=1489864044936; _ad_mobile_card_tgb_checked=1489864044939; _ad_mobile_parallax_serp_checked=1489864044941; _ad_serp_item_native_checked=1489864044943; _ad_card_toplong_exp_checked=1489864044944; _ad_serp_long_exp_checked=1489864044946; crtg_rta=; _ga=GA1.2.2070707254.1489864008; rrrbt=; rrpvid=235016421735327; amplitude_idcian.ru=eyJkZXZpY2VJZCI6IjQ1MDVkZDEwLTFmYWMtNDEwNC05Mzc2LWM4ZDJlMmQ1NTBkMVIiLCJ1c2VySWQiOm51bGwsIm9wdE91dCI6ZmFsc2UsInNlc3Npb25JZCI6MTQ4OTg2NDAwODI5MSwibGFzdEV2ZW50VGltZSI6MTQ4OTg2NDA0NTM5OCwiZXZlbnRJZCI6MCwiaWRlbnRpZnlJZCI6MCwic2VxdWVuY2VOdW1iZXIiOjB9; _ym_visorc_34229100=b; rcuid=58cd856f6636b3121cb0030f; rrpusid=58cd856f6636b3121cb0030f; rrlpuid=; _ym_visorc_67132=w; flocktory-uuid=7240a786-d5ce-4be4-ab27-b774e44169de-3', 
                        'Connection': 'keep-alive',
                        'Cache-Control': 'no-cache',
                    },
                    gzip: true
      };
        console.log('idr='+idr+' komnat='+komnat);
      request(opts, function (error, response, body) {
            if (error)
                console.log(error);
                    
            if(response && response.statusCode && response.statusCode == 200) {
                let $ = cheerio.load(body);
                let text = $('script:not([type])').eq(6).text();
                
                let tmp = '';
                try{
                    tmp = text.match(/window._offers = (.*);\s+window._region/)[1];
                    
                    let obj = JSON.parse(tmp); 
                    let first_key = '';

                    //get first key in loaded object                   
                    for(let key in obj){
                        first_key = key;                        
                        break;    
                    }

                    console.log(`page == ${page}\nstopper == ${stopper}\nfirst_key == ${first_key}`);
                    if(first_key != stopper){
                        //init stopper after fist page
                        if(stopper == '')
                            stopper = first_key;

                        //save page data    
                        console.log('page added');
                        arr.push(obj);

                        //start recursive page grubbing
                        setTimeout(function(){
                            request_url(u, arr, ++page);
                        }, 200);
                    } else {
                        //запись json
                        fs.writeFileSync(/*__dirname*/path1 + '/'+ID_Ray[idr]+'-'+komnat+'.json', JSON.stringify(arr));
                        //flexkom2=true;
                        console.log(path1 + '/'+ID_Ray[idr]+'-'+komnat+'.json'); // в консоль пишется, какой json был записан
                       tekkomjs=komnat;
                        if (komnat==3){
                            flexidr=true;
                            flexkom=false;
                            kidr=idr+1;
                            if (kidr==ID_Ray.length){    //записан последний район, выходим из цикла интервал
                                                         // и дальше опрашивать не надо
                                flexidr=false;                            
                                flex=true;
                                console.log('ВСЁ');
                            }
                            
                        }
                        else {
                            flexkom=true;
                        }
                    }
                } catch(err){
                    console.log('ERROR: ' + err);
                    res.send(JSON.stringify(err));
                    return;
                }      
            } else {
                console.log('Empty response. statusCode:', response.statusCode);
                res.send(response.statusCode);
                return;
            }
        });
  };

//idr=-1;


//opros po komnat
let flexidr=false;
let flexkom=true;
//let flexkom2=true;
let flex=false;
komnat=0;

    
let Opros1k = function(){               //опрос однушек
            flexkom==false;
            komnat=1;
            stopper='';
            var my_arr = [];
            url2(ID_Ray[idr],komnat);        //формируем урл с учётом района и количества комнат
            //console.log(url);
            //console.log('OprosKom komnat='+komnat);                            
            request_url(url, my_arr, 1);
        };
let Opros2k = function(){               //опрос двушек и трёшек
            flexkom==false;
            komnat=2;
            stopper='';
            var my_arr = [];
            url2(ID_Ray[idr],komnat);        //формируем урл с учётом района и количества комнат
            //console.log(url);
            //console.log('OprosKom komnat1='+komnat);                            
            request_url(url, my_arr, 1);
        };
let Opros3k = function(){               //опрос двушек и трёшек
            flexkom==false;
            komnat=3;
            stopper='';
            var my_arr = [];
            url2(ID_Ray[idr],komnat);        //формируем урл с учётом района и количества комнат
            //console.log(url);
            //console.log('OprosKom komnat1='+komnat);                            
            request_url(url, my_arr, 1);
        };

let ID_R= function(){       //увеличение индекса в массиве районов на 1
    idr++;
    flexidr=false;
    flexkom=true;
    komnat=0;
    tekkomjs=0
}

let OprK = function (){
        setTimeout (function OprosKom(){
            //console.log(' flexidr='+flexidr+' flexkom='+flexkom+idr+' idr='+idr+' ID_Ray.length='+ID_Ray.length);
            //console.log('ОПРОС');
        
        if (flex==true) {    //если тру, то трёшки уже опросили и пора выходить из опроса
            console.log('ТОЧНО ВСЁ');
            res.end;
            clearTimeout(OprK);
            return;
        }
        if (flexidr==true){         //увеличение индекса в массиве районов на 1, переход к след району
            ID_R();
        }
        if (flexkom==true && komnat==2 && tekkomjs==2){     //опрос трёшек
            Opros3k();

        }
        if (flexkom==true && komnat==1 && tekkomjs==1){     //опрос двушек
            Opros2k();

        }
        if (flexkom==true && komnat==0 && tekkomjs==0){       //опрос однушек
            Opros1k();
        }
        
    setTimeout(OprosKom,10000);
    },10000);
};
OprK();


/*
let flexidr=true;
let flexkom=true;
let flexkom2=true;
let flex=false;
setTimeout (function opros(){
    console.log(' flexidr='+flexidr+' flexkom='+flexkom+' flexkom2='+flexkom2+' idr='+idr+' ID_Ray.length='+ID_Ray.length);

    kidr=idr+1;
    if (flexidr==false && flexkom==false && kidr==ID_Ray.length){
        console.log('стоп');
        flex=true;
        return;
    }

    /*if (flexidr==true){     //если разрешён цикл обхода районов, то увеличиваем индекс элемента в массиве ид-районов на 1
        idr++;
        komnat=0;
        flexidr=false;
        flexkom=true;    
    }*/
    /*if (flexkom==true){     //опрос комнат, если flexkom=true
        if (komnat==0 && flexkom2==true){     // если комната=0, то увеличиваем на 1
            flexkom2=false;
            komnat++;
            stopper='';
            var my_arr = [];
            url2(ID_Ray[idr],komnat);        //формируем урл с учётом района и количества комнат
            console.log(url);
            console.log('komnat='+komnat);                            
            request_url(url, my_arr, 1);
        }
        if (komnat>0 && flexkom2==true){     // если комната=0, то увеличиваем на 1
           
               flexkom2=false;
                komnat++;
                stopper='';
                var my_arr = [];
                url2(ID_Ray[idr],komnat);        //формируем урл с учётом района и количества комнат
                console.log(url);
                console.log('komnat='+komnat);                            
                request_url(url, my_arr, 1);
           
        }
    }
    
setTimeout(opros,30000);
},1000);*/



  
});

app.listen(process.env.port || 80);
