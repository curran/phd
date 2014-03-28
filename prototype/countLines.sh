# A Unix shell script that displays the line count
# for each source code file recursively.
#
# The goal is to help keep every file under 100 lines of code.
#
# By Curran Kelleher 3/27/2014 
find . -name "*.*" |grep -v "node_modules\|README\|lib\|docs\|spec" | xargs wc -l
