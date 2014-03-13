# This shell script builds the document quickly.
# Curran Kelleher 3/12/2014

# This command just creates the PDF
# but does not resolve cross references
pdflatex proposal 

# Clean up the biproducts
rm *.aux *.log *.toc *.bbl *.blg

# Move the pdf file one level up
mv proposal.pdf ../
