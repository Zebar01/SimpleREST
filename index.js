'use strict';

let request = require('request');
let cheerio = require('cheerio');
let express = require('express');
let fs      = require('fs');

let app = express();

app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'Super pupper secret string.!.', resave: true, saveUninitialized: true }));

app.use('/api/query', function(req, res){

  let opt = {
      deal_type:      req.query.deal_type      || 'sale',
      engine_version: req.query.engine_version || 2,
      maxprice:       req.query.maxprice       || 25000000,
      minprice:       req.query.minprice       || 3000000,
      offer_type:     req.query.offer_type     || 'flat',
      district:       req.query.district       || 33,		//����� ������ ��� �������
													/* �� �������
													���� 1 : ������� 125, ������ 126, ����������-��������� 127, �������� ������ 128, �������� 129, ��������-�������� 130, ������ 131, ����� ������ 132
													��� 5 : �������� 23, ������� 24, ��������������� 25, ���������� 26, ��������� �������� 27, ����������� 28, ����������� 29, �������� �������� 30, ������� 31, ������������ 32, �������������� 33, ���������� 34, ����� 35, ������������� 36, ������� 37, ����������� 38 
													��� : ����� 13
													*/
      query_type:     req.query.query_type     || 'newquery',
	  ne1etaj:		  req.query.ne1etaj			|| 0,	// �� ������ ����
	  vtor:			  req.query.vtor			|| 1,	//������ ��������
	  only_flat:	  req.query.only_flat		||	1,
	  
	  };

  if (req.query.room1 && req.query.room1 == 1)
  {
      opt.room1 = 1;
  }

  if (req.query.room2 && req.query.room2 == 1)
  {
      opt.room2 = 1;			//���� �� ����, �� ����� ������� �� 2 ������� ������?
  }

  if (req.query.p)
  {
      opt.p = req.query.p;		//����� �������� �������
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

  
//"https://www.cian.ru/cat.php?currency=2&deal_type=sale&district%5B0%5D=33&engine_version=2&is_first_floor=0&maxprice=25000000&minprice=4000000&object_type%5B0%5D=1&offer_type=flat&only_flat=1&repair%5B0%5D=1&repair%5B1%5D=2&repair%5B2%5D=3&room1=1&totime=2592000";

let url = `https://www.cian.ru/cat.php?currency=2&deal_type=${opt.deal_type}`;
	url += `&district%5B0%5D=${opt.district}&engine_version=${opt.engine_version}`;
	url += `&is_first_floor=${opt.ne1etaj}`;	// �� ������ ����
	url += `&maxprice=${opt.maxprice}&minprice=${opt.minprice}`;
	url += `&object_type%5B0%5D=${opt.vtor}`; // ������ ��������
	url += `&offer_type=${opt.offer_type}`;
	url += `&only_flat=${opt.only_flat}`;
	url += "&repair%5B2%5D=1&repair%5B2%5D=2&repair%5B2%5D=3";		// ������ - ������������� 1, ���� 2 � ��� 3
    url += opt.room1 == 1 ? `&room1=${opt.room1}`: ``;
	url += "&totime=2592000";			// ���������� � ������� ������� �� ���������� �����������. �� �����.	
	
  //url += opt.room2 == 1 ? `&room2=${opt.room2}`: ``;		// ������� ������� �� 2 �������
  //url += opt.p ? `&p=${opt.p}`:``;	//������� � �������
  
  //url += "&sost_type=1";		// 1 - ������ ��������� �������, 2 - ������������, ���������������� ������ - ��� �����������
	
  
  
  console.log(url);
  
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
        
        //let obj = JSON.parse(text.match(/window._offers = ([^;]*);/)[1]);
        let tmp = '';
        try{
            tmp = text.match(/window._offers = (.*);\s+window._region/)[1];
            
            let obj = JSON.parse(tmp); 
            fs.writeFileSync(__dirname + '/saved.json', JSON.stringify(obj));
            res.status(200).json(obj);
            return;
        } catch(err){
            res.status(404).send(err);
            return;
        }
               
        /*
        if(obj){
            for(const k in obj){
                console.log(`${k} ${obj[k]['deal_type']} ${obj[k]['phone']}`);
            }
        }
        */
    } else {
        console.log('Empty response. statusCode:', response.statusCode);
    }
  });
});

app.listen(process.env.port || 80);


