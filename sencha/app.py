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

settings = dict(
		static_path = os.path.join(os.path.dirname(__file__),'static'),
		template_path = os.path.join(os.path.dirname(__file__),'templates'),
		debug = True,
		ui_modules={'Footer':FooterModule}
	       )


class Application(tornado.wsgi.WSGIApplication):
	def __init__(self):
		tornado.wsgi.WSGIApplication.__init__(self,handlers,**settings)
