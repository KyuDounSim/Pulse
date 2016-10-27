import requests
import re
import unicodedata
import datetime as DT
from bs4 import BeautifulSoup
import json

data=[]

def newsCrawler(article_num):
    for year in range(2003, 2017):
        url = 'http://www.ece.ust.hk/ece.php/enews/archive/' + str(year)
        source_code = BeautifulSoup(requests.get(url).text, "lxml")
        for link in source_code.findAll('td', {'class': "headline"}):
            for content_link in link.findAll('a'):
                item = {}
                item['name'] = link.get_text()
                item['link'] = ("http://www.ece.ust.hk/" + content_link.get('href'))
                item['content'] = news_content_crawler("http://www.ece.ust.hk/" + content_link.get('href'))
                item['category'] = 'News'
                #article_length = 0

                #for length in item['content']:
                    #article_length += 1
                
                #item['lenArticle'] = article_length
                data.append(item)

        for link in source_code.findAll('td', {'class': "content"}):
            try:
                formedDate = DT.datetime.strptime(str(link.get_text()), "%d %b %Y").strftime("%Y-%m-%d")
                data[article_num]['date']= formedDate
                print formedDate + " News"
                article_num += 1
            except ValueError:
                pass
    
    print("News All Crawled!")
    return article_num
            
def news_content_crawler(item_url):
    source_code = BeautifulSoup(requests.get(item_url).text, "lxml")
    for link in source_code.findAll('div'):
        return link.get_text()

def has_ten_characters(string):
    return (len(string) == 10)

def eventCrawler(article_num):
    for year in range(2003, 2017):
        url = 'http://www.ece.ust.hk/ece.php/event/archive/' + str(year)
        source_code = BeautifulSoup(requests.get(url).text, "lxml")

        for one_item in source_code.findAll('div', id = 'ctr'):
            item = {}
            for category_element in one_item.findAll('td', {'class': "e-type"}):
                if category_element.get_text().encode('utf8') == 'Seminar':
                    item['category'] = 'Seminar'
                elif category_element.get_text().encode('utf8') == 'Joint Seminar':
                    item['category'] = 'Seminar'
                elif category_element.get_text().encode('utf8') == 'Semina':
                    item['category'] = 'Seminar'
                elif category_element.get_text().encode('utf8') == 'ECE Seminar':
                    item['category'] = 'Seminar'
                elif category_element.get_text().encode('utf8') == 'HLTC Seminar':
                    item['category'] = 'Seminar'
                elif category_element.get_text().encode('utf8') == 'TRS-LED Seminar Series':
                    item['category'] = 'Seminar'
                elif category_element.get_text().encode('utf8') == 'HLTC Seminar':
                    item['category'] = 'Seminar'
                elif category_element.get_text().encode('utf8') == 'PhD Thesis Presentation':
                    item['category'] = 'Thesis'
                elif category_element.get_text().encode('utf8') == 'MPhil Thesis Presentation':
                    item['category'] = 'Thesis'
                else:
                    item['category'] = 'Events'

            for name_element in one_item.findAll('td', {'class': "headline"}):
                item['name'] = name_element.encode('utf8')
                for content_element in name_element.findAll('a'):
                    #item['content'] = event_content_crawler("http://www.ece.ust.hk/" + content_element.get('href'))
                    item['link'] = ("http://www.ece.ust.hk/"+ content_element.get('href'))
                    
            data.append(item)
            """
            td_elements = []
            for date_element in one_item.findAll('td', {'class': "content"}):
                print date_element
                td_elements.append(date_element.get_text().encode('utf8'))
            """
            #print td_elements
            for date_element in one_item.findAll('td', {'class': "content"}):
                try:
                    formedDate = DT.datetime.strptime(date_element.get_text().encode('utf8'),"%d %b %Y (%a)").strftime("%Y-%m-%d")
                    data[article_num]['date']= formedDate
                    print formedDate
                    article_num += 1
                    
                except ValueError:
                    #print "First Value Error"
                    try:
                        date_string = date_element.get_text().encode('utf8').split("-")
                        formedDate = DT.datetime.strptime(date_string[0],"%d %b %Y (%a)").strftime("%Y-%m-%d")
                        data[article_num]['date']= formedDate
                        print formedDate
                        article_num += 1
                    except ValueError:
                        #print "2nd Value Error!"
                        pass

    print "Events All Crawled!"
    return article_num
                    """
                except IndexError:
                    #print "IndexError!"
                    pass
                
                try:
                    td_elements = []
                    print one_item.findAll('td', {'class': "content"})
                    for date_element in one_item.findAll('td', {'class': "content"}):
                        for details in date_element.parentElement.findAll('td', {'class': "content"}): 
                            td_elements.append(details.get_text().encode('utf8'))
                    print td_elements
                    formedDate = DT.datetime.strptime(td_elements[4],"%d %b %Y (%a)").strftime("%Y-%m-%d")
                    data[article_num]['date']= formedDate
                    print formedDate
                    article_num += 1
                except ValueError:
                    print "Give up Error!"
                    pass
                """
"""
                

        for category in source_code.findAll('td', {'class': "e-type"}):
            for link in source_code.findAll('td', {'class': "headline"}):
                for content_link in link.findAll('a'):
                    item = {}
                    item['name'] = link.get_text()
                    #item['content'] = event_content_crawler("http://www.ece.ust.hk/" + content_link.get('href'))
                    item['link'] = ("http://www.ece.ust.hk/"+ content_link.get('href'))
                    
                    if category.get_text().encode('utf8') == 'Seminar':
                        item['category'] = 'Seminar'
                    elif category.get_text().encode('utf8') == 'Joint Seminar':
                        item['category'] = 'Seminar'
                    elif category.get_text().encode('utf8') == 'Semina':
                        item['category'] = 'Seminar'
                    elif category.get_text().encode('utf8') == 'ECE Seminar':
                        item['category'] = 'Seminar'
                    elif category.get_text().encode('utf8') == 'HLTC Seminar':
                        item['category'] = 'Seminar'
                    elif category.get_text().encode('utf8') == 'TRS-LED Seminar Series':
                        item['category'] = 'Seminar'
                    elif category.get_text().encode('utf8') == 'HLTC Seminar':
                        item['category'] = 'Seminar'
                    elif category.get_text().encode('utf8') == 'PhD Thesis Presentation':
                        item['category'] = 'Thesis'
                    elif category.get_text().encode('utf8') == 'MPhil Thesis Presentation':
                        item['category'] = 'Thesis'
                    else:
                        item['category'] = 'Events'
                    data.append(item)
                    
                td_elements = []
                for date_link in source_code.findAll('div', id = 'ctr'):
                    for meat in date_link.findAll('td', {'class': "content"}):
                        td_elements.append(meat.get_text().encode('utf8'))
                try:
                    formedDate = DT.datetime.strptime(td_elements[2],"%d %b %Y (%a)").strftime("%Y-%m-%d")
                    data[article_num]['date']= formedDate
                    print formedDate
                    article_num += 1
                except ValueError:
                    print "Wrong Two!"
                    pass
             """
    

"""
        for link in source_code.findAll('td', {'class': "content"}):
        this does not work properly
           
            try:
                formedDate = DT.datetime.strptime(str(link.get_text().encode('utf8')),"%d %b %Y (%a)").strftime("%Y-%m-%d")
                print formedDate + " event1"
                data[article_num]['date']= formedDate
                article_num += 1
            except TypeError:
                print "Wrong one!"
                pass
            except ValueError:
                print "Wrong Two!"
                pass
                """
"""
            try:
                duration = str(link.get_text().encode('utf8')).split(' ')
                formedDate=DT.datetime.strptime(duration[0], "%d %b %Y (%a)").strftime("%Y-%m-%d")
                data[article_num]['date'] = formedDate
                print formedDate + " event2"
                article_num += 1
            except ValueError:
                print "You;re wrong!"
                pass
                
            """
             
        

def event_content_crawler(item_url):
    source_code = BeautifulSoup(requests.get(item_url).text, "lxml")
    for link in source_code.findAll('div'):
        print "Event Content Crawled!"
        return link.get_text()
    
    
def achieveCrawler(article_num):
    for year in range(2003, 2017):
        faculty_url = 'http://www.ece.ust.hk/ece.php/enews/facultyarchive/' + str(year)
        student_url = 'http://www.ece.ust.hk/ece.php/enews/studentarchive/' + str(year)

        faculty_source_code = BeautifulSoup(requests.get(faculty_url).text, "lxml")
        student_source_code = BeautifulSoup(requests.get(student_url).text, "lxml")

        for link in faculty_source_code.findAll('td', {'class': "headline"}):
            for content_link in link.findAll('a'):
                item = {}
                item['name'] = link.get_text()
                item['category'] = 'Achievement'
                item['link'] = ("http://www.ece.ust.hk/" + content_link.get('href'))
                item['content'] = achievement_content_crawler("http://www.ece.ust.hk/" + content_link.get('href'))
                data.append(item)

        for link in faculty_source_code.findAll('td', {'class': "content"}):
            try:
                formedDate = DT.datetime.strptime(str(link.get_text()), "%d %b %Y").strftime("%Y-%m-%d")
                print formedDate + " Faculty Achievement!"
                data[article_num]['date']= formedDate
                article_num += 1
                                
            except ValueError:
                pass

        for link in student_source_code.findAll('td', {'class': "headline"}):
            for content_link in link.findAll('a'):
                item = {}
                item['name'] = link.get_text()
                item['category'] = 'Achievement'
                item['link'] = ("http://www.ece.ust.hk/" + content_link.get('href'))
                item['content'] = achievement_content_crawler("http://www.ece.ust.hk/" + content_link.get('href'))
                data.append(item)

        for link in student_source_code.findAll('td', {'class': "content"}):
            try:
                formedDate = DT.datetime.strptime(str(link.get_text()), "%d %b %Y").strftime("%Y-%m-%d")
                print formedDate + " Student Achievement"
                data[article_num]['date']= formedDate
                article_num += 1
                                
            except ValueError:
                pass

    print("Achievement All Crawled!")

def achievement_content_crawler(item_url):
    source_code = BeautifulSoup(requests.get(item_url).text, "lxml")
    for link in source_code.findAll('div', {'class': "content"}):
        # 'div' and 'td' would not work because it gives me null or the date*( 03 Aug 2011) like this
        # fuck you Dale, you're useless
        return link.get_text()
            		    
achieveCrawler(eventCrawler(newsCrawler(0)))

#achieveCrawler(newsCrawler(0))

#eventCrawler(0)

#achieveCrawler(0)


jsonFile = open("ECE_Events.json", "w")
jsonFile.write(json.dumps(data))
jsonFile.close()

"""
def spiderArchive(typeNumber,typeName,maxPage):
	url='http://www.seng.ust.hk/web/eng/archive.php?selF=news'
	
	urlType=url+'&selT='+str(typeNumber)+'&selY=&page='
	
	for i in range (1,maxPage+1,1):
		source_code=requests.get(urlType+str(i)).text

		soup = BeautifulSoup(source_code,"lxml")
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
"""
