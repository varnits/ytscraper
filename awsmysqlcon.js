var mysql = require('mysql');
var aws = require('aws-sdk');
var streamingS3 = require('streaming-s3');
var ytdl = require('ytdl-core');
var con = mysql.createConnection({
  host: "metadatachannel.cdz95obhjeq6.us-east-1.rds.amazonaws.com",
  port:3306,
  user: "varnit12",
  password: "password",
database: "channelwisevideo"
});
var dlink='';
var url='https://www.youtube.com/watch?v=UEHNvCSjTJY';


con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  sql="SELECT * From  videoList";
con.query(sql, function (err, result) {
    if (err) throw err;
    
    console.log(result);
    con.end();
  });
});
  
  // var sql = "CREATE TABLE videoList (videoId VARCHAR(255) PRIMARY KEY,kind VARCHAR(255), etag VARCHAR(255),datePublished VARCHAR(255),channelId VARCHAR(255),url VARCHAR(255),downloadLink VARCHAR(255))";
 //var sql = "INSERT INTO videoList (videoId, kind,etag,datePublished,channelId,url) VALUES ('UEHNvCSjTJY', 'youtube#video','XpPGQXPnxQJhLgs6enD_n8JR4Qk/emYHcbpvv46S9NFooOOVdPiCwFU','2017-01-28','UCoy4nghiBTTuXKCqT3-TpXA','https://www.youtube.com/watch?v=UEHNvCSjTJY')"; 
 //var sql = "UPDATE videoList SET downloadLink='https://s3.amazonaws.com/ytcv/UCoy4nghiBTTuXKCqT3-TpXA-UEHNvCSjTJY'  WHERE videoId='UEHNvCSjTJY'";
// sql="DELETE FROM videoList WHERE videoId='2fqwIPhAY1Q'";
//sql="DELETE FROM videoList WHERE videoId='SVFymzTo1EA'";
//sql="SELECT videoId From  videoList";
//var bucketName = process.env.S3_BUCKET; 
//sql="ALTER TABLE videoList CHANGE etag likes varchar(255)" ; 
//s//ql="ALTER TABLE videoList ADD duration varchar(255)";