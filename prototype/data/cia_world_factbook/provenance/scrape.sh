# A Bash script that fetches data from the
# CIA world factbook and scrapes data using scrape.js.
#
# By Curran Kelleher 4/3/2014
echo Fetching data
wget https://www.cia.gov/library/publications/download/download-2014/fields.zip

echo Unzipping data
unzip fields.zip

echo Scraping data
phantomjs scrape.js

echo Cleaning up files
rm fields.zip
rm -r -f fields

echo Done.
