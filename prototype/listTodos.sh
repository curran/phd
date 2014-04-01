# A Unix shell script that lists TODOs across source files.
#
# By Curran Kelleher 4/1/2014 

# $excluded is a regex for paths to exclude from search 
excluded="spec\|node_modules\|README\|lib\|docs\|csv\|XLS\|json\|png\|listTodos"

countLines(){
  # -mindepth exclues the current directory (".")
  for file in `find . -mindepth 1 -name "*.*" |grep -v "$excluded"`; do
    if [ `grep TODO $file -n | wc -l` != 0 ]
      then
        echo $file
        grep -n TODO $file
        echo
    fi
  done
}

echo Source code files:
countLines
echo Unit tests:
cd spec
countLines
