ipy2wp
======

Publish an IPython notebook on a wordpress site using xmlrpc

This tool is far from being perfect but it allows you to publish an IPython notebook on a worpress site using xmlrpc.

Usage
=====

    python ipy2wp.py [options]

You have the following options:

* --xmlrpc-url: The url to xmlrpc.php on your site
* --user: The user who will publish the post
* --password: The password of the user who will publish the post
* --nb: the path to the IPython notebook
* --title: The title of the post
* --categories: The categories for the post (the categories should be defined previously in the blog)
* --tags: tags for the post

A complete example would be:

    python ipy2wp.py --xmlrpc-url http://pybonacci.org/xmlrpc.php --user kiko --password 1_2_oh_my_god!!! --nb 'dummy.ipynb' --title 'The best post ever' --categories articles tutorials --tags strawberry lucy ipython

If there are inline images in your notebook, them will be converted and uploaded yo your wordpress blog ('wp-content/uploads') and the html code will be changed to link to the uploaded images.

The result will be a draft on your wordpress site. Please, check the draft before you publish the post as some advanced functionality could not be solved satisfactorily. If you find something wrong, please, open an issue.

License
=======

MIT, do whatever you want with it.
