# This shell script builds the document.
# Curran Kelleher 4/5/2014

# This sequence builds the document and assembles
# cross-references from the BibTeX file
pdflatex dissertation && bibtex dissertation && pdflatex dissertation && pdflatex dissertation 

# Clean up the biproducts
rm *.aux *.log *.toc *.bbl *.blg

# Move the pdf file one level up
mv dissertation.pdf ../
