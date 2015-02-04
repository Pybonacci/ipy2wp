// convert current notebook to html by calling "ipython nbconvert" and open static html file in new tab

define(['base/js/namespace','jquery'], function(IPython, $) {
    "use strict";
    if (IPython.version[0] != 3) {
        console.log("This extension requires IPython 3.x")
        return
    }
    
    
    
    /**
     * Create dialog to enter the arguments
     * 
     */
    var execute = function(){
      
      var xmlrpc   = $('<input/>')
          .attr('id','xmlrpc')
          .attr('placeholder','http://pybonacci.org/xmlrpc.php')
          .attr('type','text')
          .attr('size','80');
      var user     = $('<input/>')
          .attr('id','user')
          .attr('placeholder','wordpress username')
          .attr('type','text')
          .attr('size','80');
      var password = $('<input/>')
          .attr('id','password')
          .attr('placeholder','wordpress password')
          .attr('type','password')
          .attr('size','80');
      var posttitle = $('<input/>')
          .attr('id','posttitle')
          .attr('placeholder','wordpress post title')
          .attr('type','text')
          .attr('size','80');
      var categories = $('<input/>')
          .attr('id','categories')
          .attr('placeholder','categories separated by spaces (category should exist in the blog)')
          .attr('type','text')
          .attr('size','80');
      var tags = $('<input/>')
          .attr('id','tags')
          .attr('placeholder','tags for the post')
          .attr('type','text')
          .attr('size','80');
      var template = $('<select/>')
          .attr('id','template')
          .append('<option value="basicx">basicx</option>')
          .append('<option value="basic">basic</option>');
          
      var dialogform = $('<div/>')
        .append(
          $('<form/>').append(
            $('<fieldset/>').append(
              $('<label/>')
                .attr('for','source')
                .text("Please, add the necessary information")
             )
            .append($('<br/>'))
            .append(xmlrpc)
            .append($('<br/>'))
            .append(user)
            .append($('<br/>'))
            .append(password)
            .append($('<br/>'))
            .append(posttitle)
            .append($('<br/>'))
            .append(categories)
            .append($('<br/>'))
            .append(tags)
            .append($('<br/>'))
            .append(template)
          )
        );
        
      IPython.keyboard_manager.register_events(dialogform)
    
      IPython.dialog.modal({
        title: "Wordpress parameters",
        body: dialogform,
        buttons: {
          "Publish Draft": { 
              class : "btn-primary",
              click: function (){
				  var kernel = IPython.notebook.kernel;
                  var path = IPython.notebook.notebook_path;
                  var command = 
                      'import os, shutil, IPython; ' +
                      'pathpy = IPython.utils.path.get_ipython_dir() + \"/nbextensions/ipy2wp/ipy2wp.py\";' +
                      'pathtpl = IPython.utils.path.get_ipython_dir() + \"/nbextensions/ipy2wp/templates\";' +
                      'pathnb = os.getcwd() + \"/' + path + '\";' +
                      'path, ipynb = os.path.split(pathnb);' +
                      'shutil.copy(pathtpl, path);' +
                      'os.system(\'python {0} ' + 
                      '--xmlrpc {1} ' +
                      '--user {2} ' +
                      '--password {3} ' +
                      '--nb {4} ' +
                      '--title \"{5}\" ' +
                      '--categories {6} ' +
                      '--tags {7} ' +
                      '--template {8}\'' + 
                      '.format(pathpy' +
                         ', \"' +$.trim($(xmlrpc).val()) + '\"' +
                        ', \"' + $.trim($(user).val()) +  '\"' +
                        ', \"' + $.trim($(password).val()) + '\"' +
                        ', pathnb' +
                        ', \"' + $.trim($(posttitle).val()) + '\"' +
                        ', \"' + $.trim($(categories).val()) + '\"' +
                        ', \"' + $.trim($(tags).val()) + '\"' +
                        ', \"' + $.trim($(template).val()) + '\"' +
                        '))';
                  console.log(command)
                  kernel.execute(command);
		      }
          }
        }
      });
      
    };
    
       
    IPython.toolbar.add_buttons_group([
        {
        id : 'ipy2wp',
        label : 'Publish the notebook as a draft on wordpress',
        icon : 'fa-wordpress',
        callback : execute
        }
    ])
});
