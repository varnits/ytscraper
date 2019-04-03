# ytscraper
Problem Statement-
Create a crawler which scraps certain youtube channels regularly and downloads the videos from the channel. You have to setup this crawler in the cloud service of your choice(AWS/GCP etc) . You have to download the videos in the cloud storage of your choice. Additionally you have to scrap the metadata of video and store it in the sql table.

Sol.- ytscraper is a completely serverless application built with aws lambda, aws rds(mysql), aws S3 bucket and some npm modules for nodejs ytdl-core(https://www.npmjs.com/package/ytdl-core),
streaming-S3(https://www.npmjs.com/package/streaming-s3) and mysql(https://www.npmjs.com/package/mysql), the scraper uses 'request' and pattern matching to get video-ids of a channel.
index.js is a lambda function and awsmysqlcon.js is a helper file for viewing the table.

Lambda arn- arn:aws:lambda:us-east-1:873041759604:function:youtubetos3

S3 arn-arn:aws:s3:::videobucketforshutapp

RDS arn- arn:aws:rds:us-east-1:873041759604:db:metadatachannel

Note: AWS S3 access and secret keys, and RDS credentials are currently hard-coded.They can be better handled using AWS IAM and secrets manager.

