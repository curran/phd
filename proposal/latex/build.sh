# This shell script builds the document.
# Curran Kelleher 3/12/2014

# This sequence builds the document and assembles
# cross-references from the BibTeX file
pdflatex proposal && bibtex proposal && pdflatex proposal && pdflatex proposal 

# Clean up the biproducts
rm *.aux *.log *.toc *.bbl *.blg

# Move the pdf file one level up
mv proposal.pdf ../
