import requests
import unicodedata
import re
import json
import datetime as DT
from bs4 import BeautifulSoup

data = []

def Crawler():
    base_url = 'https://www.cse.ust.hk/pg/defenses/pastthesisdef.html'
    source_code = BeautifulSoup(requests.get(base_url).text, "lxml")
    for link in source_code.findAll(id = "maincontent"):
        for content_link in link.findAll('a'):
            formatted_string = re.sub(r'\s+', '', content_link.get_text().encode('utf8'))
            if (formatted_string == 'CurrentThesisDefensesandQualifyingExams'):
                print "ha, gotcha!"
                pass
            
            total_article = 0 
            content_code = BeautifulSoup(requests.get("https://www.cse.ust.hk/" + content_link.get('href')).text, "lxml")
            for title_content in content_code.findAll('tr'):
                for category_link in title_content('a'):
                    #print re.sub(r'\s+', '', category_link.get_text().encode('utf8'))
                    item = {}
                    elements = []
                                       
                    if re.sub(r'\s+', '', category_link.get_text().encode('utf8')) == 'PhDThesisDefence':
                        #print re.sub(r'\s+', '', category_link.get_text().encode('utf8')) + " Success!"
                        total_article += 1
                        item['category'] = 'PhD Thesis Defence'
                        for cells in title_content.findAll('td'):
                            elements.append(cells.get_text().encode('utf8'))
                        #print elements
                        try:
                            formedDate = DT.datetime.strptime(elements[0],"%d %B %Y").strftime("%Y-%m-%d")
                            item['title'] = elements[2]
                            item['date'] = formedDate
                            data.append(item)
                        except ValueError:
                            try:
                                formedDate = DT.datetime.strptime(elements[0],"%d %m %Y").strftime("%Y-%m-%d")
                                item['title'] = elements[2]
                                item['date'] = formedDate
                                data.append(item)
                            except ValueError:
                                pass
                            
                    elif re.sub(r'\s+', '', category_link.get_text().encode('utf8')) == 'PhDThesisDefense':
                        #print re.sub(r'\s+', '', category_link.get_text().encode('utf8')) + " Success!"
                        total_article += 1
                        item['category'] = 'PhD Thesis Defence'
                        
                        for cells in title_content.findAll('td'):
                            elements.append(cells.get_text().encode('utf8'))
                        try:
                            formedDate = DT.datetime.strptime(elements[0],"%d %B %Y").strftime("%Y-%m-%d")
                            item['title'] = elements[2]
                            item['date'] = formedDate
                            data.append(item)
                        except ValueError:
                            try:
                                formedDate = DT.datetime.strptime(elements[0],"%d %m %Y").strftime("%Y-%m-%d")
                                item['title'] = elements[2]
                                item['date'] = formedDate
                                data.append(item)
                            except ValueError:
                                pass
                            
                    elif re.sub(r'\s+', '', category_link.get_text().encode('utf8')) == 'MPhilThesisDefence':
                        #print re.sub(r'\s+', '', category_link.get_text().encode('utf8')) + " Success!"
                        total_article += 1
                        item['category'] = 'MPhil Thesis Defence'
                        
                        for cells in title_content.findAll('td'):
                            elements.append(cells.get_text().encode('utf8'))

                        try:
                            formedDate = DT.datetime.strptime(elements[0],"%d %B %Y").strftime("%Y-%m-%d")
                            item['title'] = elements[2]
                            item['date'] = formedDate
                            data.append(item)
                        except ValueError:
                            try:
                                formedDate = DT.datetime.strptime(elements[0],"%d %m %Y").strftime("%Y-%m-%d")
                                item['title'] = elements[2]
                                item['date'] = formedDate
                                data.append(item)
                            except ValueError:
                                pass
                            
                    elif re.sub(r'\s+', '', category_link.get_text().encode('utf8')) == 'MPhilThesisDefense':
                        #print re.sub(r'\s+', '', category_link.get_text().encode('utf8')) + " Success!"
                        total_article += 1
                        item['category'] = 'MPhil Thesis Defence'
                        
                        for cells in title_content.findAll('td'):
                            elements.append(cells.get_text().encode('utf8'))
                        try:
                            formedDate = DT.datetime.strptime(elements[0],"%d %B %Y").strftime("%Y-%m-%d")
                            item['title'] = elements[2]
                            item['date'] = formedDate
                            data.append(item)
                        except ValueError:
                            try:
                                formedDate = DT.datetime.strptime(elements[0],"%d %m %Y").strftime("%Y-%m-%d")
                                item['title'] = elements[2]
                                item['date'] = formedDate
                                data.append(item)
                            except ValueError:
                                pass
                    else:
                        #print "Do Not Belong"
                        total_article += 1
                        pass
          
            #print "Next Year!"

    
Crawler()
jsonFile = open("FINAL_CSE_Thesis_Data.json", "w")
jsonFile.write(json.dumps(data))
jsonFile.close()
