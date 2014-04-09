# A Bash script for fetching country boundary data fron Natural Earth
# and transforming them into a format usable by D3 using TopoJSON.
#
# Inspired by Mike Bostock's "Let's Make a Map"
# http://bost.ocks.org/mike/map/ 
#
# By Curran Kelleher 4/9/2014

# Fetch the countries ZIP file from Natural Earth
curl -L -O http://www.naturalearthdata.com/http//www.naturalearthdata.com/download/110m/cultural/ne_110m_admin_0_countries.zip

# Clean up by removing the original ZIP file
rm ne_110m_admin_0_countries.zip
