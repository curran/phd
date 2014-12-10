# This shell script builds the document.
# Curran Kelleher August 2014

# This sequence builds the document and assembles
# cross-references from the BibTeX file
NAME=dissertation
pdflatex $NAME && bibtex $NAME && pdflatex $NAME && pdflatex $NAME 

# Clean up the biproducts
rm *.aux *.log *.toc *.bbl *.blg

# Move the pdf file one level up
mv $NAME.pdf ../
