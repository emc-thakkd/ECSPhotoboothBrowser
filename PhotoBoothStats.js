var AWS = require('aws-sdk'); 
var html = " ";
var http = require('http');
var fs = require('fs'); // require the filesystem api
var ep = new AWS.Endpoint('object.vipronline.com');
var s3 = new AWS.S3({endpoint: ep});
var numObjects = 0;
var totalSize = 0;
var express = require('express'); // bring in the the express api
var async = require('async');
var app = express();
var mustache = require('mustache'); // bring in mustache template engine
var demodata;
var slug;
var objKeys = [];
var numImages = 8;
var allContents = [];


	app.get('/app/:slug', function(req, res){ // get the url and slug info
	slug =[req.params.slug][0]; // grab the page slug
	console.log(slug);

	// Recursive Function to account for the fact that listObjects might only return the first 1000 objects.
	// Do not call the callback function unless you receive the isTruncated as false. 
	// Testing with MaxKeys:5/7/11 led to an error that the system is giving 500 Errors at a kendrickcoleman1/photo2. 
	// Tried seeding with a URL further along and that worked fine.
	function listAllKeys(marker, cb)
	{
	  s3.listObjects({Bucket: 'emcphotobooth', Marker: marker}, function(err, data){
	  	if(err) {
	  		console.log("Error at Marker:"+marker);
	  		listAllKeys(marker,cb);
	  		return;
	  	}
	    allContents.push(data.Contents);
	    
	    console.log("1:"+allContents.length+" "+data.Contents.length+" "+data.IsTruncated);

	    if(data.IsTruncated){
	      console.log(data.NextMarker);
	      listAllKeys(data.NextMarker, cb);
	    }
	    else
	      	cb();
	  });
	}


	//Node JS works async and you want to fetch all the keys before you proceed to the next stage. 
	//Hence you async.series to have the functions be executed in order
	// First function below retrieves all the keys
	
	async.series([

	function(callback){
		//listAllKeys('ragss0/photo4.jpeg',callback, function(err, data){
		listAllKeys(null,callback, function(err, data){
  			if (err) { callback(err);}
		});
	},

	// Second function chooses the keys for which the images need to be downloaded. This is done via reservoir sampling
	// http://en.wikipedia.org/wiki/Reservoir_sampling
	function(callback){
			console.log("2:"+allContents.length);
			numObjects = totalSize = 0;
			objKeys = [];
					
		for (var contentIndex = 0; contentIndex < allContents.length;contentIndex++){
			var Contents = allContents[contentIndex];
			for (var index=0; index < Contents.length;index++) {
					var pbobject = Contents[index];
					if(pbobject.Size > 1){
						numObjects++;
						totalSize += pbobject.Size;
						if(numObjects<numImages){
							objKeys[objKeys.length] = pbobject.Key;
							console.log("length:"+objKeys.length);
							// var params = {Bucket: 'emcphotobooth', Key: pbobject.Key};
							// var file = require('fs').createWriteStream('public/photo'+numObjects+'.jpg');
							// s3.getObject(params).createReadStream().pipe(file);
							
						}else{
							var j = Math.floor((Math.random() * numObjects));
							if(j<numImages){
								objKeys[j] = pbobject.Key;
								console.log("Modifiedlength:"+objKeys.length);
							// 	var params = {Bucket: 'emcphotobooth', Key: pbobject.Key};
							// 	var file = require('fs').createWriteStream('public/photo'+j+'.jpg');
							// 	s3.getObject(params).createReadStream().pipe(file);	
							}
						}
					}
				}
			}
			demodata = [{"numUsers":parseInt(numObjects/4),"avgSize":parseInt(totalSize/numObjects)}];
			console.log("5 "+numObjects+" "+totalSize);

			callback();
	},

	//Next use the list of keys in objKeys to get the images and save them in the public directory as photo1-photo8.jpg
	function(callback){
		allContents =[];
		var doneCounter = 0;
		for(var index =0; index < objKeys.length; index++){
			var params = {Bucket: 'emcphotobooth', Key: objKeys[index]};
			var file = require('fs').createWriteStream('public/photo'+(index+1)+'.jpg');
			file.on('close', function() {
				if(++doneCounter == objKeys.length){
					callback();	
				}
   			});
			s3.getObject(params).createReadStream().pipe(file);	
		}

		// var params = {Bucket: 'emcphotobooth', Key: objKeys[objKeys.length-1]};
		// var file = require('fs').createWriteStream('public/photo'+(objKeys.length)+'.jpg');
		
		// file.on('close', function() {
  //    		callback();
  //  		});
		
		// s3.getObject(params).createReadStream().pipe(file);
	},

	// This function uses Mustache to merge static template with Records::DemoData and create the HTML page
	// The static function has logic on laying down the images and also the javascript for reloading the page every 5 seconds
	function(callback){
		console.log("6");
		var rData = {records:demodata}; // wrap the data in a global object... (mustache starts from an object then parses)
		var page = fs.readFileSync(slug, "utf8"); // bring in the HTML file
		try{
			var html = mustache.to_html(page, rData); // replace all of the data
		} catch (err){
			console.log(err);
		}
		console.log("7");
		console.log(html);
		res.send(html); // send to client
		callback();
	}
	],function(err) {
	if (err) console.log(err);
	});
	});

app.use(express.static('public'));
app.listen(3000);// start the server listening
console.log('Server running at http://127.0.0.1:3000/'); // server start up message

