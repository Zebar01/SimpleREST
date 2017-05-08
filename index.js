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
      maxprice:       req.query.maxprice       || 6000000,
      minprice:       req.query.minprice       || 5000000,
      offer_type:     req.query.offer_type     || 'flat',
      region:         req.query.region         || 1,
      query_type:     req.query.query_type     || 'newquery',
      get_app_pages:  req.query.get_all        || false,
  };

  if (req.query.room1 && req.query.room1 == 1)
  {
      opt.room1 = 1;
  }

  if (req.query.room2 && req.query.room2 == 1)
  {
      opt.room2 = 1;
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

  let url = `https://www.cian.ru/cat.php?currency=2&deal_type=${opt.deal_type}&engine_version=${opt.engine_version}&maxprice=${opt.maxprice}&minprice=${opt.minprice}&offer_type=${opt.offer_type}&region=${opt.region}`;
  
  url += opt.room1 == 1 ? `&room1=${opt.room1}`: ``;
  url += opt.room2 == 1 ? `&room2=${opt.room2}`: ``;
  url += opt.p ? `&p=${opt.p}`:``;

  let request_url = function(u, arr, page, maxpage){
      
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

      request(opts, function (error, response, body) {
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
                    
                    arr.push(obj);
                    console.log(page);
                    if(page < maxpage){
                        setTimeout(function(){
                            request_url(u, arr, ++page, maxpage);
                        }, 1000);
                    } else {
                        //save to file here
                        console.log(arr);
                    }
                } catch(err){
                    return;
                }
      
            } else {
                console.log('Empty response. statusCode:', response.statusCode);
                return;
            }
        });
  };
  var my_arr = [];
  request_url(url, my_arr, 1, 3);


});

app.listen(process.env.port || 80);


