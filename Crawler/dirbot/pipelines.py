from scrapy.exceptions import DropItem
from vaderSentiment.vaderSentiment import sentiment as vaderSentiment
import nltk

class FilterWordsPipeline(object):
    """A pipeline for filtering out items which contain certain words in their
    description"""

    # put all words in lowercase
    words_to_rank_success = ['award','congrats','conference', 'congratulations', 'achievement', 'first', 'second', 'best', 'publish', 'won', 'gold','awarded','recieved','coverage','winner','record']
    words_to_rank_tech = ['tech','technology','software','repository','repositories','app','application','data','mining','machine','electronics','algorithm','robot','robotics']
    words_to_rank_update = ['established','establishes','program','new','laboratory','lab','founded','next']
    words_to_rank_partner = ['microsoft','google','boeing','hku','acm','ibm','ieee','amway','solomon','robocup','webex','cuhk','ucla','stanford','tsinghua']
    words_to_rank_contest = ['contest','compete','competition','win','award','team']
    words_to_remove = ['and',',','.',';','(',')','?','the','at','in','on','if','with','is','to','from','of','-','by','and','for']
    

    def process_item(self, item, spider):
        try:
            item['vaderSentiment'] = vaderSentiment(item['lenArticle'])
        except:
            pass
        success_count = 0
        tech_count = 0
        update_count = 0
        partner_count = 0
        contest_count = 0
        tokens = nltk.word_tokenize(item['lenArticle'])
##        tokens = sorted(w for w in set(tokens) if len(w) > 1)
        
        for word in tokens:
            word = word.lower()
            if word in self.words_to_remove:
                tokens.remove(word)
            if word in self.words_to_rank_success:
                success_count += 1
            if word in self.words_to_rank_tech:
                tech_count += 1
            if word in self.words_to_rank_update:
                update_count += 1
            if word in self.words_to_rank_partner:
                partner_count += 1
            if word in self.words_to_rank_contest:
                contest_count += 1
                
        item['lenArticle'] = len(tokens)
        fdist = nltk.FreqDist(tokens)
        item['fdist'] = fdist.most_common(50)
        item['topic'] = {'success':success_count,'technology':tech_count,'update':update_count,'partner':partner_count,'contest':contest_count}
        return item
        """Look at the following commented out code, use a similar loop structure and """
##        for word in self.words_to_filter:
##            if word in unicode(item['description']).lower():
##                raise DropItem("Contains forbidden word: %s" % word)
##            else:
##                return item
        # This line computes the sentiment of the current article, and adds it to the solution object
