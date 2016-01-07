#coding=utf-8
#!/usr/bin/python

from xml.sax.handler import ContentHandler
from xml.sax import make_parser
from glob import glob
import json
import sys
import re
import string

class tempHandler(ContentHandler):
	def __init__(self):
		self.tags ={}
		self.currentKey = ""
		self.currentTag=""
		self.step = 0
		self.parseStep = 0
		self.pngNum = 0
		self.skip = False
	def startElement(self,name,attr):
		self.currentTag = name	
		if(name== "true") :
			self.tags[self.currentKey].append(1)
			print name,"T"
		elif (name=="false"):
			self.tags[self.currentKey].append(0)
			print name,"F"
		if name == "dict":
			if self.step == 0:
				self.step = 1
			elif self.step == 1:
				self.step = 2
			elif self.step == 2:
				self.step = 3

	def endElement(self,name):
		if (name=="dict") & (self.step==3):
			self.step = 2

	def characters(self,content):
		if (self.step == 2):
			if(self.currentTag=="key"):
				if((content.find(' ') != 0)  and (content.find('\n') != 0) ):
					self.currentKey = content
					self.parseStep = 0
					self.tags[content] =[] 
					print content
		elif (self.step==3):
			if((content.find(' ') != 0) and (content.find('\n') != 0)):
#	self.tags[self.currentKey].append(content)
				self.parseStep = self.parseStep + 1
				if self.parseStep in [2,4,7,9]:
					pattern = re.compile(r'\d+')
					tempdata = re.findall(pattern,content)
					print repr(tempdata)
					self.tags[self.currentKey].append(map(lambda x:string.atoi(x),tempdata))	
#				print "------",repr(content),"\t\t",self.parseStep

			

	def endDocument(self):
		print repr(self.tags)
		print "JSON\n",json.dumps(self.tags)
		f = open('temp.json','w')
		f.write(json.dumps(self.tags))

def parsefile(filename):
	parser = make_parser()
	parser.setContentHandler(tempHandler())
	parser.parse(filename)

for arg in sys.argv[1:]:
	for filename in glob(arg):
			parsefile(filename)

