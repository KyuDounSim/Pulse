from scrapy.item import Item, Field


class Website(Item):

    name = Field()
    description = Field()
    date = Field()
    lenArticle = Field()
    vaderSentiment = Field()
    type = Field()
