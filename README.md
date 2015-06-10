ipy2wp
======

Publish an IPython notebook on a wordpress site using xmlrpc

This tool is far from being perfect but it allows you to publish an IPython notebook on a wordpress site using xmlrpc from the command line or from the notebook itself.

Usage
=====

There are two ways to use this tool:

From the command line
---------------------

    python /path/to/ipy2wp.py [options]

You have the following options:

* --xmlrpc-url: The url to xmlrpc.php on your site
* --user: The user who will publish the post
* --password: The password of the user who will publish the post
* --nb: the path to the IPython notebook
* --title: The title of the post
* --categories: The categories for the post (the categories should be defined previously in the blog)
* --tags: tags for the post
* --template: The template to be used. If no template is provided then the basic IPython notebook html template is used. [See the templates section for more info](https://github.com/Pybonacci/ipy2wp#templates).

A complete example would be:

    python ipy2wp.py --xmlrpc-url http://pybonacci.org/xmlrpc.php --user kiko --password 1_2_oh_my_god!!! --nb 'dummy.ipynb' --title 'The best post ever' --categories articles tutorials --tags strawberry lucy ipython --template basic

*It works on IPython/Jupiter 2.0+  and Python 2.7+ and 3.3+*

From the notebook
-----------------

You should load the nbextension in the following way:

* Donload the repo and copy the `ipy2wp/` folder in your local `ipython_dir/nbextensions/` folder. To get your `ipython_dir` you could use the following code:

```python
import IPython
ip=IPython.get_ipython()
ip.ipython_dir
```

* Now you should have the following folder (in my case `ipython_dir = '/home/kiko/.ipython/'`):

`/home/kiko/.ipython/nbextensions/ipy2wp/`

* In that folder you should have the following file structure:

```
.
├── ipy2wp.js
├── ipy2wp.py
└── templates
    └── basicx.tpl
```

To load the extension you can do the following in an IPython/Jupyter notebook code cell:

```
%%javascript
IPython.load_extensions('ipy2wp/ipy2wp')
```

Once is loaded you would see a new button in the toolbar with the wordpress logo:

![image](https://raw.githubusercontent.com/Pybonacci/ipy2wp/master/images/wordpress_button.png)

If the button is pressed the following dialog will appear:

![image](https://raw.githubusercontent.com/Pybonacci/ipy2wp/master/images/dialog.png)

*It works only on Jupyter and Linux :-(*

Notebook inline images
======================

If there are inline images in your notebook, them will be converted and uploaded yo your wordpress blog ('wp-content/uploads') and the html code will be changed to link to the uploaded images.

Result
======

The result will be a draft on your wordpress site. Please, check the draft before you publish the post as some advanced functionality could not be solved satisfactorily. If you find something wrong, please, open an issue.

Templates
=========

Right now you can choose between the **basic** and the **basicx** templates. 

* The **basic** template is that used by nbconvert.
* The **basicx** template is similar to the **basic** template but it eliminates the input and output prompt numbers, most of the css classes and injects some css code to highlight the code cells as in the notebook.

If you want to provide new templates just send a PR or open an issue describing your needs.

License
=======

MIT, do whatever you want with it.
