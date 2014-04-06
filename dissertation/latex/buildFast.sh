# This shell script builds the document quickly.
# Curran Kelleher 4/5/2014

# This command just creates the PDF
# but does not resolve cross references
pdflatex dissertation 

# Clean up the biproducts
rm *.aux *.log *.toc *.bbl *.blg

# Move the pdf file one level up
mv dissertation.pdf ../
