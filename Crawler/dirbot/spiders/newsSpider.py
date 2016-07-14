import scrapy
from scrapy.spiders import Spider
from scrapy.selector import Selector

from dirbot.items import Website

# The following line imports the sentiment analysis tool
from vaderSentiment.vaderSentiment import sentiment as vaderSentiment
import nltk

class NewsSpider(Spider):
    name = "news"
    # allowed_domains = ["cse.ust.hk"]
    start_urls = [
        "http://www.cse.ust.hk/News/",
    ]

    def parse(self, response):
	# The following line selects all the urls in the maincontent dic, but not the ones in the hnav ul
	# These are then appended to the list of urls to be parsed, each of which is parsed through parse_dir_contents
	for href in response.xpath('//div[@id="maincontent"]/ul[not(@class="hnav")]/li/a/@href'):
            url = response.urljoin(href.extract())
            yield scrapy.Request(url, callback=self.parse_dir_contents)
        
    def parse_dir_contents(self,response):
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
