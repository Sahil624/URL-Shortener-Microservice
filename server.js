var express = require('express');
var mongo = require('mongodb').MongoClient;

var app = express();
var url = 'mongodb://localhost:27017/url';

app.get('/',function(req,res){
    res.sendFile('./index.html',{root : __dirname});
})

app.get('/new/:full',function(req,res){

    var fullurl = req.params.full;
    
    var shorturl = Math.random()*100000;
    shorturl = Math.floor(shorturl);
    
    mongo.connect(url,function(err,db){
        if ( err ){
            res.send('Database could not be connected. ERROR',err);
        }
        
        else{
             var data = db.collection('urls');
            var entry = {"Fullurl": fullurl,"Shorturl": shorturl};
            data.insert(entry);
            res.send(entry);
            db.close();
        }
    });
});

app.get('/clear',function(req,res){
    mongo.connect(url,function(err,db){
        if ( err ){
            res.send('Database could not be connected. ERROR',err);
        }
        
        else{
            var data = db.collection('urls');
            data.remove(function(err) {
            if (err) throw err
                console.log('success');
            db.close()
    });
        }
        
    });
})


app.get('/:short',function(req,res){
    var shorturl = req.params.short;
    
    mongo.connect(url,function(err,db){
        if ( err ){
            res.send('Database could not be connected. ERROR',err);
        }
        
        else{
            
            var data = db.collection('urls');
            shorturl = parseInt(shorturl);
            data.find({Shorturl:shorturl}).toArray(function(err,docs){
            console.log(docs);
                
            if(err){
            throw err;
            }
            
            else if ((docs.length)<=0){
                res.send('URL Not found');
            }
            
            else{
                res.redirect('http://'+docs[0].Fullurl);
            }
            });
            
            /* Possible Solution too need to be debugged
            
            
            var data = db.collection('urls');
            shorturl = parseInt(shorturl);
            data.findOne({
              "Shorturl": shorturl
            }, function(err, result) {
              if (err) throw err;
              // object of the url
              if (result) {
                // we have a result
                console.log('Found ' + result);
                console.log('Redirecting to: ' + result.original_url);
               // res.redirect(result.original_url);
              }
                else{
                    res.send('No Url found');
                }
        })*/
        }
    });
   // res.send(shorturl);
})

app.listen(1337,function(){
    console.log('1337');
})