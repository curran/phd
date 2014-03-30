This directory contains information about how the `un_population` data set was imported into the Universal Data Cube.

Listing of files:

 * `WPP2012_POP_F01_1_TOTAL_POPULATION_BOTH_SEXES.XLS` The original Excel file downloaded from the link [Total Population - Both Sexes](http://esa.un.org/wpp/Excel-Data/EXCEL_FILES/1_Population/WPP2012_POP_F01_1_TOTAL_POPULATION_BOTH_SEXES.XLS) on the United Nations page [World Population Prospects: The 2012 Revision](http://esa.un.org/wpp/Excel-Data/population.htm).
 * `raw.csv` The part of the original spreadsheet that contains population estimates (from sheet "ESTIMATES"), manually exported using Excel
 * `preprocess.js` The Node.js script that transforms `raw.csv` into `../un_population.csv` and `un_code_name_concordance.csv`

Note that country codes draw from [UN M.49](http://en.wikipedia.org/wiki/UN_M.49).

Draws from [first attempt](https://github.com/curran/data/tree/gh-pages/un/population).

By Curran Kelleher 3/30/2014
