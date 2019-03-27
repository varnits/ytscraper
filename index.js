var fetchVideoInfo = require('youtube-info');
var streamingS3 = require('streaming-s3');
var ypi = require('youtube-channel-videos');
var ytdl = require('ytdl-core');
var fetchVideoInfo = require('youtube-info');
var mysql = require('mysql');
//  To fetch values from Lambda env
//  var s3accesskeyid=process.env.ACCESSKEYID;
//  var secretkey=process.env.SECRETACCESSKEY;
//  var hostname=process.env.HOST;
//  var username=process.env.USERNAME;
//  var password=process.env.PASSWORD; 
//  var database=process.env.DATABASE;  

// Access key and secret for S3 bucket
var s3accesskeyid='AKIAJWTWERQZR52ZWUEQ';
var secretkey='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';
var bucketname='videobucketforshutapp';

// RDS details and access credentials
var hostname='metadatachannel.cdz95obhjeq6.us-east-1.rds.amazonaws.com';
var username="varnit12";
var password='password'; 
var database='channelwisevideo';

// Youtube API key
var youtubeapikey='AIzaSyD4sRwSYx5oMqxkqFHDTOe2-RQliO19cyg';

var arr=[];
var j=0;
var flag=true;
var data='';
var vidir='';
var vidarr=[];
var sql='';
var i=0;
var dl=0;
var url='';
var last=0;

// Youtube channel to scrap
var channelId='UCoy4nghiBTTuXKCqT3-TpXA';

// Connect to RDS DB
var con;

exports.handler =  (event, context, callback) => {
  //prevent timeout from waiting event loop
    context.callbackWaitsForEmptyEventLoop = false;
  con = mysql.createConnection({
      host: hostname,
      port:3306,
      user: username,
      password: password,
      database:database
    });
    con.connect(function(err) {
      if (err) throw err;
    console.log("Connected!");
    looper();
  });

// Fetch videos of the channel
ypi.channelVideos(youtubeapikey, channelId, function(channelItems) {
    data=channelItems;
    console.log(data.length);
    for (var item of data) {
        vidir=item.id.videoId;
        vidarr.push(vidir);
        console.log(vidir);}
        looper();
    });
}

// Loop over the videos and find out missing videos to download
function looper(){
 for(var vidid of vidarr){
    sd="SELECT * FROM videoList WHERE videoId="+"\'";
    stl=sd+vidid+"\'";

  sql=stl;
   con.query(sql, function (err, result) {
      if (err) throw err;
         if(result!='') {
             arr.push(0);
             console.log("contains");
            }
            else {
                arr.push(1);
                console.log(result);
             }
             if(arr.length==vidarr.length){
              console.log(arr);
              caller();
             }
     });
    }}

// initiate download for required indexes, if there are no videos to download, update metadata   
function caller() {
last=arr.lastIndexOf(1);
if(last==-1) {
  metadataupdate();
}
for ( i=0; i< arr.length;i++) {
    if(arr[i]==1){
        download(i);
    }
}
}

//download video and update metadata after the last video is downloaded
function download(dl){
        url='https://www.youtube.com/watch?v='+vidarr[dl];
        
        var uploader =new streamingS3(
         
            ytdl(url, { filter: (format) => format.container === 'mp4' })
             , {accessKeyId: s3accesskeyid, secretAccessKey: secretkey},   
           {
           Bucket: bucketname,
              Key: channelId+"-11"+vidarr[dl],
               ContentType: 'video/mp4',
             },
             (err, res, stats) => {
               if (err) console.log(err);
               sql="INSERT INTO videoList (videoId,downloadLink) VALUES ("+"'"+vidarr[dl]+"','s3://videobucketforshutapp/"+channelId+"-11"+vidarr[dl]+"')";
               con.query(sql, function (err, result) {
                console.log(sql);
                    if (err) throw err;
                    // update metadata after the last video is downloaded                     
                    if (dl==last){
                      metadataupdate();
                    }
               console.log('success', stats);
             }
           );
       }
       )};

  //update metadata in mysql table     
function metadataupdate(){
         
       for (var it of vidarr){
         
        fetchVideoInfo(it).then(function (videoInfo) {
          sql="UPDATE videoList SET videoId="+"'"+videoInfo.videoId+"'"+",kind="+"'"+videoInfo.genre+"'"+",dislikeCount="+"'"+videoInfo.dislikeCount+"'"
          +",duration="+"'"+videoInfo.duration+"'"+",url="+"'"+videoInfo.url+"'"+",likes="+"'"+videoInfo.likeCount+"'"+",datePublished="+"'"
          +videoInfo.datePublished+"'"+",channelId="+"'"+videoInfo.channelId+"'"+",views="+"'"+videoInfo.views+"' "+",title="+"'"+videoInfo.title+"' "
          +"WHERE videoId="+"'"+videoInfo.videoId+"'";
               con.query(sql, function (err, result) {
   
                 if (err) throw err;
               
                //  console.log(i++);
                  j++;
                if(j>=vidarr.length){
                  con.end();
                  console.log("endconhere"+j);
                }
                  
              });
            console.log(videoInfo.views);
        });
      
      }
      }
    // var sql = "CREATE TABLE videoList (videoId VARCHAR(255) PRIMARY KEY,kind VARCHAR(255), etag VARCHAR(255),datePublished VARCHAR(255),channelId VARCHAR(255),url VARCHAR(255),downloadLink VARCHAR(255))";
    //var sql = "INSERT INTO videoList (videoId, kind,etag,datePublished,channelId,url) VALUES ('UEHNvCSjTJY', 'youtube#video','XpPGQXPnxQJhLgs6enD_n8JR4Qk/emYHcbpvv46S9NFooOOVdPiCwFU','2017-01-28','UCoy4nghiBTTuXKCqT3-TpXA','https://www.youtube.com/watch?v=UEHNvCSjTJY')"; 
   // var sql = "SELECT*FROM videoList WHERE videoId='ss'"/*+vidid*/;
//sql = "INSERT INTO videoList (videoId, kind,etag,datePublished,channelId,url) VALUES ('2fqwIPhAY1Q', 'youtube#video','XpPGQXPnxQJhLgs6enD_n8JR4Qk/emYHcbpvv46S9NFooOOVdPiCwFU','2017-01-28','UCoy4nghiBTTuXKCqT3-TpXA','https://www.youtube.com/watch?v=UEHNvCSjTJY')"; 
//sql="UPDATE videoList SET videoId="+"'"+videoInfo.videoId+"'"+"kind="+"'"+videoInfo.genre+"'"+"etag="+"'"+videoInfo.likeCount+"'"+"datePublished="+"'"+videoInfo.datePublished+"'"+"kind="+"'"+videoInfo.genre+"'"+"WHERE videoId="+"'"+it+"'";
//UPDATE table_name
//SET column1 = value1, column2 = value2, ...
//WHERE condition;
    
    