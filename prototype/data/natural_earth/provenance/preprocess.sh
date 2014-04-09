# A Bash script for fetching country boundary data fron Natural Earth
# and transforming them into a format usable by D3 using TopoJSON.
#
# Draws from Mike Bostock's "Let's Make a Map"
# http://bost.ocks.org/mike/map/ 
#
# See also org2org documentation:
# http://www.gdal.org/ogr2ogr.html
#
# By Curran Kelleher 4/9/2014

echo Fetching countries ZIP file from Natural Earth
curl -L -O http://www.naturalearthdata.com/http//www.naturalearthdata.com/download/110m/cultural/ne_110m_admin_0_countries.zip

echo Unzipping the file
unzip ne_110m_admin_0_countries.zip

echo Converting the .shp file to GeoJSON
ogr2ogr -f GeoJSON countriesGeoJSON.json ne_110m_admin_0_countries.shp

echo Converting GeoJSON to TopoJSON
topojson -p name -o ../countries.json countriesGeoJSON.json

echo Clean up
rm ne_110m_admin_0_countries*
rm countriesGeoJSON.json

echo Done! Created ../countries.json
