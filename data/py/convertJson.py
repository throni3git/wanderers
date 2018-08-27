import json, datetime
from pprint import pprint

with open('news2.json') as f:
	data = json.load(f)
	print(data)
	
	allEntries = data["news"]
	for entry in allEntries:
		parsedDT = datetime.datetime.strptime(entry["date"], "%B %d, %Y %H:%M:%S")
		isoDT = parsedDT.isoformat()
		entry["date"] = isoDT
	
	fileHandle = open("news3.json", "w");
	json.dump(data, fileHandle, ensure_ascii=False, indent='\t', separators=(',', ': '))
	fileHandle.close()
	
	