import os, json, re

# read the fuck out of this file
fileHandle = open("data-news.php", "r");
fileContent = fileHandle.read()
fileHandle.close()

tabless = fileContent.replace("\t", "")
lineless = tabless.replace("\n", "");
spaceless = lineless
for i in range(1, 20):
	spaceless = spaceless.replace("  ", " ")

print(spaceless)

beginEntry = '$news[] = array('
beginTitle = '"title" => "'
endTitle = '",'
beginDate = '"date" => "'
endDate = '",'
beginDescription = '"description" => "'
endDescription = '");'

unfinished = True
pos = 0
while pos < len(spaceless):
	print(pos)
	pos = spaceless.find(beginEntry, pos);
	pos += len(beginEntry)
	
	pos = spaceless.find(beginTitle, pos)
	pos += len(beginTitle)
	endPos = spaceless.find(endTitle, pos)
	caption = spaceless[pos:endPos]
	pos = endPos
	print(caption)
	
	pos = spaceless.find(beginDate, pos)
	pos += len(beginDate)
	endPos = spaceless.find(endDate, pos)
	daaate = spaceless[pos:endPos]
	pos = endPos
	print(daaate)
	
	pos = spaceless.find(beginDescription, pos)
	pos += len(beginDescription)
	endPos = spaceless.find(endDescription, pos)
	description = spaceless[pos:endPos]
	pos = endPos
	print(description)
	

# print(fileContent)