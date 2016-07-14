import scrapy
from scrapy.spiders import Spider
from scrapy.selector import Selector

from dirbot.items import Website

# The following line imports the sentiment analysis tool
from vaderSentiment.vaderSentiment import sentiment as vaderSentiment
import nltk

class NewsSpider(Spider):
    name = "test"
    # allowed_domains = ["cse.ust.hk"]
    start_urls = [
        "http://www.cse.ust.hk/News/ACM_SIGMOD2016/",
    ]
        
    def parse(self,response):
	# This creates an instance of the item, the definition of which is stored in items.py
	item = Website()
	
	# The if statement checks if there exists a div with id = 'maincontent', suggesting we are on the cse website, hence no error will be thrown
	if (response.xpath('//div[@id="maincontent"]') != []):
		for sel in response.xpath('//div[@id="maincontent"]'):
			item['name'] = sel.xpath('h1/text()').extract()
			temp = []
			for ptag in sel.xpath('p'):
				temp += ptag.xpath('text()').extract()
			
		
	else:
		item["name"] = response.xpath('//h1/text()').extract()
		temp = []
		for ptag in response.xpath('//p'):
			temp += ptag.xpath('text()').extract()
	
	description = "" 
	for i in temp:
		description += i
	item['lenArticle']= description
	
	# This basically gets the first part of the text from the right p tag of the footer, converts it into a str, and slices the needed part
	dateText =  response.xpath('//div[@id="footer"]/p[@class="right"]/text()[1]').extract()
	date = dateText[0]
	item['date'] = date[16:]
	yield item
