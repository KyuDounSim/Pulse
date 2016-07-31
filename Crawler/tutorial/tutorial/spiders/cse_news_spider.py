import scrapy

from scrapy.selector import Selector
from scrapy.http import HtmlResponse

class CSE_Spider(scrapy.Spider):
    name = "cse_crawler"
    allowed_domains = ["cse.ust.hk"]
    start_urls = [
        "https://www.cse.ust.hk/News/?type=news",
        "https://www.cse.ust.hk/News/?type=event",
        "https://www.cse.ust.hk/News/?type=achievement",
        "http://www.cse.ust.hk/pg/defenses/pastthesisdef.html",
        "http://www.cse.ust.hk/pg/seminars/pastseminars.html"
    ]

    def parse(self, response):
        if "News" in response.url:
            yield scrapy.Request(response.url, callback = self.parse_news)
        elif "Events" in response.url:
            yield scrapy.Request(response.url, callback = self.parse_events)
        elif "Achievement" in response.url:
            yield scrapy.Request(response.url, callback = self.parse_achievements)
        elif "Defenses" in response.url:
            yield scrapy.Request(response.url, callback = self.parse_defenses)
        else:
            yield scrapy.Request(response.url, callback = self.parse_seminars)

        """

        for href in response.xpath():

    	
    	sel = Selector(response)
        sites = sel.xpath('//ul[@class="directory-url"]/li')
        items = []

        for site in sites:
            item = Website()
            item['url'] = site.xpath('a/text()').extract()
            item['year'] = site.xpath('a/@href').extract()
            items.append(item)

        return items

        """

    def parse_news(self, response):
        for href in response.xpath('//div[@id="maincontent"]/ul[not(@class="hnav")]/li/a/@href'):
            url = response.urljoin(href.extract())
            item['category'] = "News"
            yield scrapy.Request(url, callback=self.parse_Contents)
        print "news scraped"


    def parse_events(self, response):
        for href in response.xpath('//div[@id="maincontent"]/ul[not(@class="hnav")]/li/a/@href'):
            url = response.urljoin(href.extract())
            item['category'] = "Events"
            yield scrapy.Request(url, callback=self.parse_Contents)
        print "events scraped"


    def parse_achievements(self, response):
        for href in response.xpath('//div[@id="maincontent"]/ul[not(@class="hnav")]/li/a/@href'):
            url = response.urljoin(href.extract())
            item['category'] = "Achievements"
            yield scrapy.Request(url, callback=self.parse_Contents)
        print "Achievements scraped"

    def parse_Contents(self, response):
        if (response.xpath('//div[@id="maincontent"]') != []):
            for sel in response.xpath('//div[@id="maincontent"]'):
                item['title'] = sel.xpath('h1/text()').extract()
                temp = []
                for ptag in sel.xpath('p'):
                    temp += ptag.xpath('text()').extract()
                        
        else:
        	item["title"] = response.xpath('//h1/text()').extract()
        	temp = []
        	for ptag in response.xpath('//p'):
        		temp += ptag.xpath('text()').extract()
        	item['content'] = "" 

	        for i in temp:
	        	item['content'] += i
	        dateText =  response.xpath('//div[@id="footer"]/p[@class="right"]/text()[1]').extract()
	        date = dateText[0]
	        item['date'] = date[16:]
	        yield item

        # This creates an instance of the item, the definition of which is stored in items.py        
        # The if statement checks if there exists a div with id = 'maincontent', 
        #suggesting we are on the cse website,
        # hence no error will be thrown

"""

    def parse_defenses(self, response):

    def parse_seminars(self, response):
"""
"""

        filename = response.url.split("/")[-2] + '.html'
        with open(filename, 'wb') as f:
            f.write(response.body)  

        """
