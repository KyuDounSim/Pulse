# Pulse

The aim of the project is to create a system to present data gathered from various departmental websites of HKUST in a visually appealing and easily understandable way using the principles of data visualization to help analyze trends.

### Structure

We are using the Scrapy framework on Python for crawling the websites. All files related to it are in the *Crawler* folder. As of now, the spider gets all News, Seminar and Thesis Defense articles from the CSE department website.The files coresponding to sentiment analysis are for now included within the spider.

We are using D3.js for Data Visualization. The files coresponding to the same are in the folder labelled D3.

**To Do**
* Expand crawler to crawl websites of other departments as well.
* Find more appropriate tools to mine opinion/sentiment from the articles
* Solve issue of sentiment tool crashing when it encounters chinese text
* Finalize design of visualization system
