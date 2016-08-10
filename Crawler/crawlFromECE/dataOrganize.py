import json
from operator import itemgetter
import datetime as DT

with open('dataECE.json') as json_data:
    data = json.load(json_data)

# print(data) 

start=DT.datetime(data[0]['date'],"%Y-%m-%d")
end=DT.datetime(data[len(data)-1]['date'],"%Y-%m-%d")


x=0
list=[]
monthData=[]
item=[]
for i in range(0,len(data),1):
	now=DT.datetime.strptime(data[i]['date'],"%Y-%m-%d").strftime('%Y-%m')
	if not now in list:
		list.append(now)
		item[x]['studentAchievement']=0
		item[x]['facultyAchievement']=0
		item[x]['PhDThesisPresentation']=0
		item[x]['MPhilThesisPresentation']=0
		item[x]['seminar']=0
		item[x]['event']=0
		item[x]['date']=now
		item[x][data(x)['category']]+=1
		x+=1
	else:
		item[x][data(x)['category']]+=1		

# for i in range(0,count,1):
# 	now=start.timedelta(days=i)
# 	global x
# 	while DT.datetime.strptime(data[x]['date'],"%Y-%m-%d").strftime('%Y-%m') ==now.strftime('%Y-%m'):
# 		if not DT.datetime.strptime(data[x]['date'],"%Y-%m-%d").strftime('%Y-%m') in list:
# 			list.append(data[x]['date'])
# 			item={}
# 			item['studentAchievement']=0
# 			item['facultyAchievement']=0
# 			item['PhDThesisPresentation']=0
# 			item['MPhilThesisPresentation']=0
# 			item['seminar']=0
# 			item['event']=0
# 			item['date']=now.strftime('%Y-%m')
# 			item[data(x)['category']]+=1
# 			x+=1
# 		else:
# 			item[data(x)['category']]+=1
# 			x+=1




			



