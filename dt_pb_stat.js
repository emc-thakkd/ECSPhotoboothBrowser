var AWS = require('aws-sdk'); 
var ep = new AWS.Endpoint('object.vipronline.com');
var s3 = new AWS.S3({endpoint: ep}); 
s3.listBuckets(function(err, data) {
		if (err) { console.log("Error:", err); }
		else {
			for (var index in data.Buckets) {
				var bucket = data.Buckets[index];
				console.log("Bucket: ", bucket.Name, ' : ', bucket.CreationDate);
			}
		}
});
