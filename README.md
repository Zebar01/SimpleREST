#Simple REST API Sever

Simple REST API Server

```
git clone https://github.com/AnatoliyAksenov/SimpleREST.git
npm install
node index
```

Query examples:

Doing new query and save results to local file
```
curl localhost/api/query
```
or
```
curl localhost/api/query?query_type=newquery
```

Doing query from local file
```
curl localhost/api/query?query_type=saved
```

Query parameters:

* **deal_type**: 
    * sale - apartments for sale
    * rent - apartments for rent
* **engine_version**: *2* - only
* **maxprice**: maximal price in query
* **minprice**: minimal price in query
* **offer_type**: *flat* - only 
* **region**: region index *(The Moscow index is 1)*
* **room1**: query 1-room apartments *(add to query if need to add to results 1-room apartments)*
* **room2**: query 2-room apartments *(add to query if need to add to results 1-room apartments)*
* **p**: page of query




