from scrapy.item import Item, Field


class Website(Item):
        name = Field()
        date = Field()
        lenArticle = Field()
        vaderSentiment = Field()
        category = Field()
        fdist = Field()
        topic = Field()
