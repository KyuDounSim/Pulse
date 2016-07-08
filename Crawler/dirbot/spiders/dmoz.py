import scrapy
from scrapy.spiders import Spider
from scrapy.selector import Selector

from dirbot.items import Website

# The following line imports the sentiment analysis tool
from vaderSentiment.vaderSentiment import sentiment as vaderSentiment

class DmozSpider(Spider):
    name = "dmoz"
    # allowed_domains = ["cse.ust.hk"]
    AUTO_THROTTLE_ENABLED = True
    start_urls = [
        "http://www.cse.ust.hk/News/",
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
	for href in response.xpath('//div[@id="maincontent"]/ul[not(@class="hnav")]/li/a/@href'):
            url = response.urljoin(href.extract())
            yield scrapy.Request(url, callback=self.parse_Contents)
        print "it worked"

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
            item["type"] = "Seminar"
        else:
            item["type"] = "Thesis Defense"
        item['name'] = response.xpath('//h1/text()').extract()
        item['description'] = response.xpath('//pre/text()').extract()[0]
        item['lenArticle']= len(item['description'].split())
        item['vaderSentiment'] = vaderSentiment(item['description'])
        # This basically gets the first part of the text from the right p tag of the footer, converts it into a str, and slices the needed part
        dateText =  response.xpath('//div[@id="footer"]/p[@class="right"]/text()[1]').extract()
        date = dateText[0]
        item['date'] = date[16:]
        yield item
    
    def parse_Contents(self,response):
        # This creates an instance of the item, the definition of which is stored in items.py
        item = Website()
        item['type'] = "News"
        
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
        
        item['description'] = "" 
        for i in temp:
                item['description'] += i
        item['lenArticle']= len(item['description'].split())
        # This line computes the sentiment of the current article, and adds it to the solution object
        item['vaderSentiment'] = vaderSentiment(item['description'])
        # This basically gets the first part of the text from the right p tag of the footer, converts it into a str, and slices the needed part
        dateText =  response.xpath('//div[@id="footer"]/p[@class="right"]/text()[1]').extract()
        date = dateText[0]
        item['date'] = date[16:]
        yield item
