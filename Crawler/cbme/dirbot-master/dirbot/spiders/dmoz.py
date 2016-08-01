import scrapy
from scrapy.spiders import Spider
from scrapy.selector import Selector

from dirbot.items import Website


class DmozSpider(Spider):
    name = "dmoz"
    allowed_domains = ["cbme.ust.hk"]
    start_urls = [
        "http://www.cbme.ust.hk/cgi-bin/news.php?year=all",
        "http://www.cbme.ust.hk/cgi-bin/spotlight.php?year=all",
    ]

    def parse(self, response):
    	if "news" in response.url:
            yield scrapy.Request(response.url, callback=self.parse_news)
            print "Parse_News"
        else:
            yield scrapy.Request(response.url, callback=self.parse_spotlight)
            print "Parse_Spotlight"


    def parse_news(self, response):
    	#log.msg('parse(%s)' % response.url, level = log.DEBUG)
    	
    	# I need to check if the rows are properly "parseing" the table content.
    	rows = response.xpath('//div[@class="subbody-left"]/table/tbody/tr')
    	
    	# The following the "For" loop does not work
    	for row in rows:
            item = Website()
            item['category'] = 'News'
            item['date'] = row.xpath('div[@id="news_section_nonowner"]/p/strong').extract()
            item['lenArticle'] = row.xpath('div[@id="news_section_nonowner"]/p/text()').extract()
            #item['length_article'] = response.xpath('//*[@id="news_section_nonowner"]/p/text()').extract()[0]
            pass

    def parse_spotlight(self, response):
    	#log.msg('parse(%s)' % response.url, level = log.DEBUG)
    	rows = response.xpath('//*[@id="contentbody-lefts"]/div[2]/table/tr')

    	for row in rows:
            item = Website()
            item['category'] = 'Spotlights'
            item['date'] = response.xpath('//*[@id="contentbody-lefts"]/div[2]/table/tbody/tr[1]/td/p/strong').extract()
            item['lenArticle'] = response.xpath('//*[@id="contentbody-lefts"]/div[2]/table/tbody/tr[1]/td/p/text()').extract()
            #item['length_article'] = response.xpath('//*[@id="contentbody-lefts"]/div[2]/table/tbody/tr[1]/td/p/text()').extract()[0]
            pass



    


    """
        sel = Selector(response)
        sites = sel.xpath('//ul[@class="directory-url"]/li')
        items = []

        for site in sites:
            item = Website()
            item['name'] = site.xpath('a/text()').extract()
            item['url'] = site.xpath('a/@href').extract()
            item['description'] = site.xpath('text()').re('-\s[^\n]*\\r')
            items.append(item)

        return items
	"""
