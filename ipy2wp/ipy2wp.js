// convert current notebook to html by calling "ipython nbconvert" and open static html file in new tab

define(
    [
        'base/js/namespace',
        'base/js/dialog',
        'jquery'
    ], 
    function(IPython, dialog, $) {
        "use strict";
        if (parseInt(IPython.version[0]) < 4) {
           alert("This extension requires IPython/Jupyter version >= 4.x")
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
              .attr('placeholder','tags for the post separated by spaces')
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
                 )    // fieldset append
            
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
              )    // form append
              
            );    // div append
        
          IPython.keyboard_manager.register_events(dialogform)
    
          dialog.modal({
              title: "Wordpress parameters",
              body: dialogform,
              buttons: {
                  "Publish Draft": { 
                      class : "btn-primary",
                      click: function (){
	    			      var kernel = IPython.notebook.kernel;
                          var path = IPython.notebook.notebook_path;
                          var command = 
                          'import os, shutil; ' +
                          'from jupyter_core.paths import jupyter_data_dir; ' +
                          'sep = os.path.sep; ' +
                          'pathpy = os.path.join(jupyter_data_dir(), \"nbextensions\", \"ipy2wp\", \"ipy2wp.py\"); ' +
                          'pathtpl = os.path.join(jupyter_data_dir(), \"nbextensions\", \"ipy2wp\", \"templates\"); ' +
                          'pathnb = os.getcwd() + \"/' + path + '\";' +
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
                          kernel.execute(command);
		              }  // end of click function
                  }   // end of Publish Draft object
              }    // end of buttons object
          });    // end of dialog modal
      
        };  // end of execute function
    
        /**
        * Add button to launch the dialog to enter the parameters
        * 
        */
        IPython.toolbar.add_buttons_group([
            {
                id : 'ipy2wp',
                label : 'Publish the notebook as a draft on wordpress',
                icon : 'fa-wordpress',
                callback : execute
            }
        ])
    }
);
