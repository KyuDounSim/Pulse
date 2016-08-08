import requests
import datetime as DT
from bs4 import BeautifulSoup
import json

data=[]
n=0
def spiderArchive(typeNumber,typeName,maxPage):
	url='http://www.seng.ust.hk/web/eng/archive.php?selF=news'
	

	
	urlType=url+'&selT='+str(typeNumber)+'&selY=&page='
	
	for i in range (1,maxPage+1,1):
		source_code=requests.get(urlType+str(i)).text

		soup =BeautifulSoup(source_code,"lxml")
		# n=len(data)
		global n
		for link in soup.findAll('a',{'class':"news_link"}):
			item={}
			item['category']=typeName
			item['title']=link.string
			data.append(item)
		
		for td in soup.findAll('td',{'class':"news_date"}):
			date=DT.datetime.strptime(td.string, "%d / %m / %Y").strftime("%Y-%m-%d")
			data[n]['date']=date
			# print(data[n])
			n=n+1
	
		# print(data)
		# s=json.dumps(data)

		# with open("dataEng.json","w") as file:
		# 	file.write(s)
	###type 2, announcement

def spiderThisYear(typeNumber,typeName,maxPage):
	url='http://www.seng.ust.hk/web/eng/news.php?id='+str(typeNumber)+'&cur2=type&page='
	for i in range (1,maxPage+1,1):
		source_code=requests.get(url+str(typeNumber)).text
		soup=BeautifulSoup(source_code,"lxml")
		global n
		for link in soup.findAll('a',{'class':"news_link"}):
			item={}
			item['category']=typeName
			item['title']=link.string
			data.append(item)
		
		for td in soup.findAll('td',{'class':"news_date"}):
			date=DT.datetime.strptime(td.string, "%d / %m / %Y").strftime("%Y-%m-%d")
			data[n]['date']=date
			# print(data[n])
			n=n+1




spiderArchive(1,'academic',8)
print(len(data))
spiderArchive(11,'announcement',4) 
print(len(data))
spiderArchive(7,'teachingAndLearning',8)
print(len(data))
spiderArchive(4,'studentAchievement',10)
print(len(data))
spiderArchive(10,'seminar',4)
print(len(data))
spiderArchive(3,'facultAchievement',10)
print(len(data))
spiderArchive(6,'collaboration',7)
print(len(data))
spiderArchive(2,'research',10)
print(len(data))
spiderArchive(5,'alumniAchievement',3)
print(len(data))
spiderThisYear(1,"academic",2)
spiderThisYear(11,"announcement",2)
spiderThisYear(7,'teachingAndLearning',2)
spiderThisYear(4,'studentAchievement',2)
spiderThisYear(10,'seminar',2)
spiderThisYear(3,'facultAchievement',2)
spiderThisYear(6,'collaboration',2)
spiderThisYear(2,'research',2)
spiderThisYear(5,'alumniAchievement',2)
print(len(data))




jsonFile = open("dataEng.json", "w")
jsonFile.write(json.dumps(data))
jsonFile.close()



