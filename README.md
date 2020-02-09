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

## Optional - Testing offline prior to deployment 
For this you need to install the plugin serverless-offline by running `npm install serverless-offline` or `yarn add serverless offline`
while in your project directory. Then add a plugins section in your serverless.yml file with serverless-offline as an item in the array:

```
plugins:
  - serverless-offline
```

Then in your command prompt or terminal, run `serverless offline` or `sls offline`. By default it starts a server with the 
address localhost:3000 which you can visit to test your endpoints, if any.
