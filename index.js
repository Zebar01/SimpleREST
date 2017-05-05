'use strict';

let request = require('request');
let cheerio = require('cheerio');
let express = require('express');
let fs      = require('fs');
let mktemp = require('mktemp');
let app = express();
let mkdirp = require('mkdirp');




app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'Super pupper secret string.!.', resave: true, saveUninitialized: true }));

app.use('/', express.static(__dirname + '/public/app/'));

//let ArrayIdDistrict = [1]//,125,126,127,128,129,130,131,132] //массив с ид-районов

app.use('/api/query', function(req, res){

    //****************************************************** */
    //выборка с перебором всех страниц
    let page = 1;         // переменная - страницы
    let fl_1str = false;     // флаг первой страницы
    let pageurl='&p=';      // переменная для номера опрашиваемой страницы
    //console.log(pageurl);
    let opt = {
            deal_type:      req.query.deal_type      || 'sale',
            engine_version: req.query.engine_version || 2,
            maxprice:       req.query.maxprice       || 25000000,
            minprice:       req.query.minprice       || 3000000,
            offer_type:     req.query.offer_type     || 'flat',
            district:       req.query.district       || 6,		//Район Москвы для выборки
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
            query_type:     req.query.query_type    || 'newquery',
            ne1etaj:		req.query.ne1etaj		|| 0,	// не первый этаж
            vtor:			req.query.vtor			|| 1,	//только вторичка
            only_flat:	    req.query.only_flat		|| 1,
            kolkom:         req.query.room          || 1,  //количество комнат
    };
    //Дата и время
    let now = new Date();         
    let god = now.getFullYear();
    let mes = now.getMonth()+1;
    let den = now.getDate();
    //проверка существования директории и её создание, если нет
    let pathjs =`/public/json/cian/`+god+'/'+mes+'/'+den;       //год-месяц-день
    let path1=__dirname+pathjs;

 //   for(var i=1; i<2; i++){
      //***************************************** */
      // интервал
    
//setTimeout(function(){}, 2000);
//********************************** */
        pageurl='&p='+1;//i;        //временно пока цикл не работает
        console.log(pageurl);
             
    //******************************************************* */
    //создание папки - работает
        mkdirp(path1, function (err) {
            if (err) console.error(err)
            else console.log(path1)   //путь к созданной папкев терминале*/
        });
        //******************************************************* 
      /* if (req.query.p)
        {
            opt.p = req.query.p;
        }
        if(opt.query_type == 'saved'){
            if(fs.existsSync(__dirname +'/saved.json'))
            {
                let saved = require(__dirname + '/saved.json');
                res.status(200).json(saved);
                return;
            } else {
                res.status(404).send('Saved results not found');
                return;
            }
        */
            //` - одинарные кавычки на ё   
        //*******************************************************************
        // формирование url 
        let url = `https://www.cian.ru/cat.php?currency=2&deal_type=${opt.deal_type}`;
            url += `&district%5B0%5D=${opt.district}&engine_version=${opt.engine_version}`;
            url += `&is_first_floor=${opt.ne1etaj}`;	// не первый этаж
            url += `&maxprice=${opt.maxprice}&minprice=${opt.minprice}`;
            url += `&object_type%5B0%5D=${opt.vtor}`; // только вторичка
            url += `&offer_type=${opt.offer_type}`;
            url += `&only_flat=${opt.only_flat}`;
            url += `${pageurl}`;
            url += "&repair%5B2%5D=1&repair%5B2%5D=2&repair%5B2%5D=3";		// ремонт, косм - 1, евро - 2, без - 3
            url += opt.kolkom == 1 ? '&room1=1': '';
            url += opt.kolkom == 2 ? '&room2=1': '';
            url += opt.kolkom == 3 ? '&room3=1': '';
            url += "&totime=2592000";			// выборка за месяц
            url += opt.p ? `&p=${opt.p}`:``;	// еcли выборка на нескольких листах
        console.log(url);
    //******************************************************************** */
    //*********************************************************************
    //   запрашиваем и сохраняем json в файл 
        request({
            url: url,
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
            gzip: true,
        }, function (error, response, body) {
            if (error)
                console.log(error);
            if(response && response.statusCode && response.statusCode == 200) {
            //fs.writeFileSync('test.log',body);
            let $ = cheerio.load(body);
            let text = $('script:not([type])').eq(6).text();
            if (fl_1str==false){
                let tmp = '';       // если первая страница ещё не обнаружена, то это начало выборки
            }
            
            try{
                console.log('point1');
                tmp = tmp+text.match(/window._offers = (.*);\s+window._region/)[1]; //!!!!!! не выполняется !!!!!!!!
                console.log('point2');
                let obj = JSON.parse(tmp); 
                
                //запись/перезапись json. в будущем реалиовать запись 1 раз в конце цикла
                fs.writeFileSync(path1 + '/'+`${opt.district}`+'-'+`${opt.kolkom}`+'.json', JSON.stringify(obj));
                //*************************************** */
                // проверка наличия в json предложения №1
                let b ={};
                b=false;
                if(obj){
                    for(const k in obj){
                        let pos ={};                   
                        pos=`${obj[k]['phone_data_layer']['position']}`;             
                          if(pos==1){
                            b=true;//define here
                            if (fl_1str=true){
                                i=100000; //если первая страница вновь обнаружена, то выходим из цикла фор
                            }
                        }
                        console.log(pos);
                        console.log(b);
                    }
                }
                
                //****************************************************** */
                res.status(200).json(obj);
                return;
            } catch(err){
                res.status(404).send(err);
                return;
            }
        } else {
                console.log('Empty response. statusCode:', response.statusCode);
        }
            
        });
 //   }; //конец цикла for переборки страниц
});
app.listen(process.env.port || 80);

