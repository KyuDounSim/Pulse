import scrapy
from scrapy.spiders import Spider
from scrapy.selector import Selector

from dirbot.items import Website

# The following line imports the sentiment analysis tool
from vaderSentiment.vaderSentiment import sentiment as vaderSentiment
# The following line imports the natural language tool kit
import nltk

class DmozSpider(Spider):
    name = "dmoz"
    # allowed_domains = ["cse.ust.hk"]
    start_urls = [
        "http://www.cse.ust.hk/News/?type=event",
        "http://www.cse.ust.hk/News/?type=achievement",
        "http://www.cse.ust.hk/News/?type=news",
	"http://www.cse.ust.hk/pg/defenses/pastthesisdef.html",
        "http://www.cse.ust.hk/pg/seminars/pastseminars.html"
    ]

    def parse(self, response):
	if "News" in response.url:
	    yield scrapy.Request(response.url,callback=self.parse_News)
	else:
            yield scrapy.Request(response.url,callback=self.parse_Other)
	
    def parse_News(self,response):
	# The following line selects all the urls in the maincontent dic, but not the ones in the hnav ul
	# These are then appended to the list of urls to be parsed, each of which is parsed through parse_dir_contents
        news = False
        event = False
        ach = False
        if "news" in response.url:
            news = True
        elif "event" in response.url:
            event = True
        elif "achievement" in response.url:
            ach = True
        else:
            print "Fuck"
	for href in response.xpath('//div[@id="maincontent"]/ul[not(@class="hnav")]/li/a/@href'):
            url = response.urljoin(href.extract())
            if ach:
                yield scrapy.Request(url, callback=self.parse_AContents)
            elif event:
                yield scrapy.Request(url, callback=self.parse_EContents)
            else:
                yield scrapy.Request(url, callback=self.parse_NContents)
                
##        print "it worked"

    def parse_Other(self,response):
        for href in response.xpath('//div[@id="maincontent"]/ul/li/a/@href'):
            url = response.urljoin(href.extract())
            yield scrapy.Request(url, callback=self.parse_Detail)

    def parse_Detail(self,response):
        for href in response.xpath('//div[@id="maincontent"]/table/tbody/tr/td/a/@href'):
            url = response.urljoin(href.extract())
            yield scrapy.Request(url, callback=self.parse_other_contents)

    def parse_other_contents(self,response):
        item = Website()
        if "seminar" in response.url:
            item["category"] = "Seminar"
        else:
            item["category"] = "Thesis Defense"
        item['name'] = response.xpath('//h1/text()').extract()
##        item['description'] = response.xpath('//pre/text()').extract()[0]
        item['lenArticle']= response.xpath('//pre/text()').extract()[0]
##        item['vaderSentiment'] = vaderSentiment(item['description'])
        # This basically gets the first part of the text from the right p tag of the footer, converts it into a str, and slices the needed part
        dateText =  response.xpath('//div[@id="footer"]/p[@class="right"]/text()[1]').extract()
        date = dateText[0]
        item['date'] = date[16:]
        yield item
    
    def parse_NContents(self,response):
        # This creates an instance of the item, the definition of which is stored in items.py
        item = Website()
        item['category'] = "News"
        
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
        # This line computes the sentiment of the current article, and adds it to the solution object
##        item['vaderSentiment'] = vaderSentiment(item['description'])
        # This basically gets the first part of the text from the right p tag of the footer, converts it into a str, and slices the needed part
        dateText =  response.xpath('//div[@id="footer"]/p[@class="right"]/text()[1]').extract()
        date = dateText[0]
        item['date'] = date[16:]
        yield item

    def parse_EContents(self,response):
        # This creates an instance of the item, the definition of which is stored in items.py
        item = Website()
        item['category'] = "Event"
        
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
        # This line computes the sentiment of the current article, and adds it to the solution object
##        item['vaderSentiment'] = vaderSentiment(item['description'])
        # This basically gets the first part of the text from the right p tag of the footer, converts it into a str, and slices the needed part
        dateText =  response.xpath('//div[@id="footer"]/p[@class="right"]/text()[1]').extract()
        date = dateText[0]
        item['date'] = date[16:]
        yield item
        
    def parse_AContents(self,response):
        # This creates an instance of the item, the definition of which is stored in items.py
        item = Website()
        item['category'] = "Achievement"
        
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
        # This line computes the sentiment of the current article, and adds it to the solution object
##        item['vaderSentiment'] = vaderSentiment(item['description'])
        # This basically gets the first part of the text from the right p tag of the footer, converts it into a str, and slices the needed part
        dateText =  response.xpath('//div[@id="footer"]/p[@class="right"]/text()[1]').extract()
        date = dateText[0]
        item['date'] = date[16:]
        yield item
