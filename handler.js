const { scrapeIndeedListings, scrapeIndeedDetails } = require('./scraper');

exports.main = async event => {
  try {
    const { baseUrl, query } = event;
    const url = `${baseUrl}/jobs?q=${query}&sort=date`;
    const listings = await scrapeIndeedListings(url);
    await scrapeIndeedDetails(listings);
    return 'Successfully saved scraped data to table';
  } catch (e) {
    return `Error: ${e}`;
  }
};
