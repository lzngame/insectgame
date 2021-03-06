 # coding:utf-8
import json
import os.path
import tornado.httpserver
import tornado.ioloop
import tornado.web
import tornado.options
import csv

from tornado.options import define,options
define('port',default=8000,help='run...',type=int)

class IndexHandler(tornado.web.RequestHandler):
	def get(self):
		self.render('index.html',title='游戏v0.0.1')

class JsModule(tornado.web.UIModule):
    	def render(self):
   		return "" 
	def javascript_files(self):
        	return "sencha-touch-all-debug.js","app.js"
        
	
class CheckHandler(tornado.web.RequestHandler):
	def get(self):
#		self.set_status(500)
		self.write({'name':'Mark','age':30})
	def post(self):
#self.set_status(500)
		self.write({'Jhon':'30'})

infodic ={
        'homedata':'homedata.csv',
        'depotdata':'depotdata.csv',
        'bugsdata':'bugs.csv',
        'mapdata':'mapa.csv',
        'landforminfo':'landformconfig.csv',
        'bugsinfo':'bugsconfig.csv',
        'enemyinfo':'enemyconfig.csv',
        'goodsinfo':'goodsconfig.csv'
        }

def getCsvJsonst(filename):
      	f = file(filename,'rb')
	reader = csv.reader(f)
	l = []
	for row in reader:
		l.append(row)
        dic = [] 
	f.close()
	head = l[0]
	for item in l[1:]:
		n = 0
		dictmp={}
		for i in head:
			dictmp[head[n]] = item[n]
			n = n+1
		dic.append(dictmp)
	jsonst = json.dumps(dic)
	return jsonst

class GetInsectInfo(tornado.web.RequestHandler):
	def get(self,story_id):
                self.write(getCsvJsonst('csv/'+infodic[story_id]))

class GetMapInfo(tornado.web.RequestHandler):
        def get(self,mapid):
                filename = ('%s%s%s' % ('csv/mapdata/mapdata',mapid,'.csv'))
                print filename
                self.write(getCsvJsonst(filename))
                 

class GetBugsInfo(tornado.web.RequestHandler):
	def get(self):
                jsonst = getCsvJsonst('bugs.csv')
		self.write(jsonst)

class GetHomedata(tornado.web.RequestHandler):
	def get(self):
		f = file('csv/homedata.csv','rb')
		reader = csv.reader(f)
		l = []
		for row in reader:
			l.append(row)
		dic={}
		f.close()
		for item in l[1:]:
			dic[item[0]] = item[1]
			print item[1]
		jsonst = json.dumps(dic)
		print jsonst
		self.write(jsonst)

if __name__ == '__main__':
	tornado.options.parse_command_line()
	app = tornado.web.Application(
			handlers = [
			(r'/',IndexHandler),
			(r'/check',CheckHandler),	
			(r'/gethomedata',GetHomedata),
			(r'/getbugsinfo',GetBugsInfo),
                        (r'/getinsectinfo/([a-z]+)',GetInsectInfo),
                        (r'/getcurrentmap/([1-9]+)',GetMapInfo),
			],
			template_path = os.path.join(os.path.dirname(__file__),"templates"),
			static_path = os.path.join(os.path.dirname(__file__),"static"),
			ui_modules={'appjs':JsModule},
			debug = True
			)
	http_server = tornado.httpserver.HTTPServer(app)
	http_server.listen(options.port)
	tornado.ioloop.IOLoop.instance().start()
