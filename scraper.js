const AWS = require('aws-sdk');
const axios = require('axios');
const cheerio = require('cheerio');
const moment = require('moment');

AWS.config.update({ region: 'us-east-1' });
const docClient = new AWS.DynamoDB.DocumentClient();

const tableName = process.env.TABLE_NAME;

exports.scrapeIndeedListings = async url => {
  try {
    let listings = [];
    let country;
    const result = await axios.get(url);
    const html = result.data;
    const $ = await cheerio.load(html);
    const mainUrl = new URL(url);
    const domain = mainUrl.origin;
    listings = $('.jobsearch-SerpJobCard')
      .map((i, el) => {
        const titleElement = $(el).find('.jobtitle');
        const jobTitle = $(titleElement).attr('title');
        const jobUrl = `${domain}${$(titleElement).attr('href')}`;

        if (domain === 'https://de.indeed.com') country = 'DE';
        else if (domain === 'https://www.indeed.pt') country = 'PT';
        else country = 'ES';

        let jobId = new URL(jobUrl);
        jobId = jobId.searchParams.get('jk');
        const listing = { jobTitle, jobUrl, jobId, country };
        listings.push(listing);
        return listings;
      })
      .get();
    // REMOVE DUPLICATES
    listings = listings.filter((listing, i) => listings.indexOf(listing) === i);
    return listings;
  } catch (e) {
    return `Error: ${e}`;
  }
};

exports.scrapeIndeedDetails = async listings => {
  await Promise.all(
    listings.map(async listing => {
      try {
        const result = await axios.get(listing.jobUrl);
        const html = result.data;
        const $ = await cheerio.load(html);
        const desc = $('.jobsearch-jobDescriptionText').text();
        const regex = /(node\.js)|(graphql)|(react)|(mongodb)|(aws)|(dynamodb)|(lambda)|(codecommit)|(git)|(serverless)|(cloudformation)|(docker)|(kubernetes)/gi;
        const company = $('div.icl-u-lg-mr--sm.icl-u-xs-mr--xs').text();
        const applyUrl = $('.icl-Button.icl-Button--primary').attr('href');
        let intersection = desc.match(regex);
        intersection = intersection.filter(
          (el, i) => intersection.indexOf(el) === i
        );
        listing.company = company;
        listing.applyUrl = applyUrl;
        listing.numMatches = intersection.length;
        listing.matchedKeyWords = intersection;
        await docClient
          .put({
            TableName: tableName,
            Item: {
              jobTitle: listing.jobTitle,
              country: listing.country,
              jobUrl: listing.jobUrl,
              jobId: listing.jobId,
              company: listing.company,
              applyUrl: listing.applyUrl,
              numMatches: listing.numMatches,
              matchedKeyWords: listing.matchedKeyWords,
              timestamp: moment().unix(),
              expires: moment()
                .add(3, 'days')
                .unix()
            },
            ConditionExpression: '#numMatches <> :numMatches',
            ExpressionAttributeNames: {
              '#numMatches': 'numMatches'
            },
            ExpressionAttributeValues: {
              ':numMatches': 0
            }
          })
          .promise();
      } catch (e) {
        return `Error: ${e}`;
      }
    })
  );
};
