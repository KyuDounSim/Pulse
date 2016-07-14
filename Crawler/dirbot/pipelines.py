from scrapy.exceptions import DropItem
from vaderSentiment.vaderSentiment import sentiment as vaderSentiment
import nltk

class FilterWordsPipeline(object):
    """A pipeline for filtering out items which contain certain words in their
    description"""

    # put all words in lowercase
    words_to_rank_success = ['award','congrats','conference', 'congratulations', 'achievement', 'first', 'second', 'competition', 'best', 'publish', 'won', 'gold','awarded','recieved','coverage']
##    words_to_rank_

    def process_item(self, item, spider):
        try:
            item['vaderSentiment'] = vaderSentiment(item['lenArticle'])
        except:
            pass
        
        tokens = nltk.word_tokenize(item['lenArticle'])
##        tokens = sorted(w for w in set(tokens) if len(w) > 1)
        item['lenArticle'] = len(tokens)
        fdist = nltk.FreqDist(tokens)
        item['fdist'] = fdist.most_common(50)
        return item
        """Look at the following commented out code, use a similar loop structure and """
##        for word in self.words_to_filter:
##            if word in unicode(item['description']).lower():
##                raise DropItem("Contains forbidden word: %s" % word)
##            else:
##                return item
        # This line computes the sentiment of the current article, and adds it to the solution object
