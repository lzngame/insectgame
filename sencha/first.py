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
		self.render('index.html',title='游戏v0.0.0')

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

class GetHomedata(tornado.web.RequestHandler):
	def get(self):
		f = file('homedata.csv','rb')
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
#self.write('{"k":\"%s\"}' % dic['home_title'])
		self.write(jsonst)

if __name__ == '__main__':
	tornado.options.parse_command_line()
	app = tornado.web.Application(
			handlers = [
			(r'/',IndexHandler),
			(r'/check',CheckHandler),	
			(r'/gethomedata',GetHomedata)
			],
			template_path = os.path.join(os.path.dirname(__file__),"templates"),
			static_path = os.path.join(os.path.dirname(__file__),"static"),
			ui_modules={'appjs':JsModule},
			debug = True
			)
	http_server = tornado.httpserver.HTTPServer(app)
	http_server.listen(options.port)
	tornado.ioloop.IOLoop.instance().start()
