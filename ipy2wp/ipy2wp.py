# -*- coding: utf-8 -*-

## Based on the work made by brave people and stored on
##   https://github.com/ipython-contrib/IPython-notebook-extensions

import datetime
import argparse
from binascii import a2b_base64
import re
import os
import shutil
try:
    import xmlrpc.client as xmlrpclib #python3
except:
    import xmlrpclib # python2

import IPython.nbconvert as nbc
from IPython.config import Config

c = Config({'HTMLExporter':{'template_path':['.', '/']}})
CSS_CODE = """.highlight .hll {background-color:#ffffcc}.highlight {background:#f8f8f8;}.highlight .c {color:#408080;font-style:italic}.highlight .err {border:1px solid #FF0000}.highlight .k {color:#008000;font-weight:bold}.highlight .o {color:#666666}.highlight .cm {color:#408080;font-style:italic}.highlight .cp {color:#BC7A00}.highlight .c1 {color:#408080;font-style:italic}.highlight .cs {color:#408080;font-style:italic}.highlight .gd {color:#A00000}.highlight .ge {font-style:italic}.highlight .gr {color:#FF0000}.highlight .gh {color:#000080;font-weight:bold}.highlight .gi {color:#00A000}.highlight .go {color:#888888}.highlight .gp {color:#000080;font-weight:bold}.highlight .gs {font-weight:bold}.highlight .gu {color:#800080;font-weight:bold}.highlight .gt {color:#0044DD}.highlight .kc {color:#008000;font-weight:bold}.highlight .kd {color:#008000;font-weight:bold}.highlight .kn {color:#008000;font-weight:bold}.highlight .kp {color:#008000}.highlight .kr {color:#008000;font-weight:bold}.highlight .kt {color:#B00040}.highlight .m {color:#666666}.highlight .s {color:#BA2121}.highlight .na {color:#7D9029}.highlight .nb {color:#008000}.highlight .nc {color:#0000FF;font-weight:bold}.highlight .no {color:#880000}.highlight .nd {color:#AA22FF}.highlight .ni {color:#999999;font-weight:bold}.highlight .ne {color:#D2413A;font-weight:bold}.highlight .nf {color:#0000FF}.highlight .nl {color:#A0A000}.highlight .nn {color:#0000FF;font-weight:bold}.highlight .nt {color:#008000;font-weight:bold}.highlight .nv {color:#19177C}.highlight .ow {color:#AA22FF;font-weight:bold}.highlight .w {color:#bbbbbb}.highlight .mb {color:#666666}.highlight .mf {color:#666666}.highlight .mh {color:#666666}.highlight .mi {color:#666666}.highlight .mo {color:#666666}.highlight .sb {color:#BA2121}.highlight .sc {color:#BA2121}.highlight .sd {color:#BA2121;font-style:italic}.highlight .s2 {color:#BA2121}.highlight .se {color:#BB6622;font-weight:bold}.highlight .sh {color:#BA2121}.highlight .si {color:#BB6688;font-weight:bold}.highlight .sx {color:#008000}.highlight .sr {color:#BB6688}.highlight .s1 {color:#BA2121}.highlight .ss {color:#19177C}.highlight .bp {color:#008000}.highlight .vc {color:#19177C}.highlight .vg {color:#19177C}.highlight .vi {color:#19177C}.highlight .il {color:#666666}"""

#options
parser = argparse.ArgumentParser(description='Publish ipynb to wp')
parser.add_argument('--xmlrpc-url', 
    help="The XML-RPC server/path url")
parser.add_argument('--user', 
    help="The wordpress user")
parser.add_argument('--password', 
    help="The wordpress user password")
parser.add_argument('--nb', 
    help="The path and notebook filename")
parser.add_argument('--title', 
    help="The title for the post in the site")
parser.add_argument('--categories', nargs='+', 
    help="A list of categories separated by space")
parser.add_argument('--tags', nargs='+', 
    help="A list of tags separated by space")
parser.add_argument('--template',
    help="The template to be used, if none then basic is used")
args = parser.parse_args()

err_msg = "You should provide a value for the option --{}"

if args.xmlrpc_url:
    server = xmlrpclib.ServerProxy(args.xmlrpc_url)
else:
    raise Exception(err_msg.format('xmlrpc-url'))

if args.user:
    user = args.user
else:
    raise Exception(err_msg.format('user'))

if args.password:
    password = args.password
else:
    raise Exception(err_msg.format('password'))

if args.template:
    tpl = args.template
    if tpl in ['basicx']:
        pathtpl, _ = os.path.split(os.path.abspath(__file__))
        pathtpl = os.path.join(pathtpl, 'templates', "{}.tpl".format(tpl))
    post = """<style>{}</style>\n""".format(CSS_CODE)
else:
    pathtpl = "basic"
    post = ""
   
if args.nb:
    post += nbc.export_html(nb = args.nb, 
                            template_file = pathtpl, 
                            config = c)[0]
else:
    raise Exception(err_msg.format('nb'))

if args.title:
    title = args.title
else:
    raise Exception(err_msg.format('title'))

if args.categories:
    categories = args.categories
else:
    categories = ['Uncategorized']

if args.tags:
    tags = args.tags
else:
    tags = ''

# Let's extract the images and upload to wp
pat = re.compile('src="data:image/(.*?);base64,(.*?)"',  re.DOTALL)
count = 1
postnew = post
for (ext, data) in pat.findall(post):
    datab = a2b_base64(data)
    datab = xmlrpclib.Binary(datab)
    imgtitle = title.replace(' ','_').replace('.','-')
    out = {'name': imgtitle + str(count) + '.' + ext,
           'type': 'image/' + ext,
           'bits': datab,
           'overwrite': 'true'}
    count += 1
    image_id = server.wp.uploadFile("", 
                                    user, 
                                    password, 
                                    out)
    urlimg = image_id['url']
    postnew = postnew.replace('data:image/' + ext + ';base64,' + data, 
                               urlimg)

if __name__ == '__main__':
    ## Publishing the post
    date_created = xmlrpclib.DateTime(datetime.datetime.now())
    status_published = 0
    wp_blogid = ""
    data = {'title': title, 
            'description': postnew,
            'post_type': 'post',
            'dateCreated': date_created,
            'mt_allow_comments': 'open',
            'mt_allow_pings': 'open',
            'post_status': 'draft',
            'categories': categories, 
            'mt_keywords': tags}
    post_id = server.metaWeblog.newPost(wp_blogid, 
                                        user, 
                                        password, 
                                        data, 
                                        status_published)
