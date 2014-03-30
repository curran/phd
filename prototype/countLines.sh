# A Unix shell script that displays the line count
# for each source code file recursively.
#
# The goal is to keep every file under 100 lines of code.
#
# By Curran Kelleher 3/30/2014 

echo "Source code files:"
find . -mindepth 1 -name "*.*" |grep -v "spec\|node_modules\|README\|lib\|docs\|csv\|XLS\|json\|png" | xargs wc -l

echo "Unit tests:"
cd spec
find . -mindepth 1 -name "*.*" |grep -v "spec\|node_modules\|README\|lib\|docs\|csv\|XLS\|json\|png" | xargs wc -l
