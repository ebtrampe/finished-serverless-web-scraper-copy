# Serverless web scraper
Copy of my project in CodeCommit 

## Install serverless globally
Run `npm i -g serverless`

## Resolve dependencies
Run `npm install` or `yarn` 

## Deploy changes to AWS 
Run `serverless deploy` or `sls deploy`

## Remove or delete the entire stack from AWS 
Run `serverless remove` or `sls remove`

## Invoking the scraper at a specified rate
I used CloudWatch event rules to invoke my function every 12 hours. I also create several targets with different constant JSON input of different search queries which the function expects in the event body. Below is a sample of this JSON:

```
{
  "baseUrl": "https://www.indeed.com.pt",
  "query": "fullstack javascript developer"
}
```
Use similar event body when testing the lambda function via the console.
