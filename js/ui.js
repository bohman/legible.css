(function($) {


  //
  // Setup
  //
  window.leg = {
    ref: {}
  }


  //
  // Init functions
  // 
  leg.init = {

    // References
    references: function() {
      leg.ref.css = '';
      leg.ref.css_array = {};
      leg.ref.style_container = $('.legible-css');
      leg.ref.controls = $('.controls');
    },

    // Sync range and inputs
    sync: function() {
      leg.ref.controls.find('input[type="range"]').each(function(){
        var range = $(this);
        var input_id = range.attr('id').replace('-range', '-input');
        var input = $('#' + input_id);

        // When loading
        var val = range.val();
        input.val(val);

        // On change on range
        range.on('input', function(e){
          var val = $(this).val();
          input.val(val);
        });

        // On keyup on text
        input.keyup(function(e){
          var val = $(this).val();
          range.val(val);
        });

      });
    },

    // Build CSS at proper times
    build_runtimes: function() {

      // On load
      leg.fn.build_css();

      // On change
      leg.ref.controls.find('input').change(function(){
        leg.fn.build_css();
      });

      // On input
      leg.ref.controls.find('input[type="range"]').on('input', function(){
        leg.fn.build_css();
      });

      // On keyup
      leg.ref.controls.find('input[type="text"], input[type="number"]').keyup(function(){
        leg.fn.build_css();
      });
    },

    // Other interactions
    toggle_css: function() {
      $('.show-css').click(function(e){
        leg.fn.toggle_css();
        e.preventDefault();
      });
    }
  }


  //
  // Functions
  // 
  leg.fn = {

    // Build CSS
    build_css: function() {
      leg.ref.css_array = [];
      leg.ref.css = '';

      // Basic legible
      var setup = {
        selectors: ['.legible'],
        styles: {
          font_size: $('#font-size-range').val() + 'px',
          line_height: $('#line-height-range').val() + 'em'
        }
      }
      leg.ref.css_array.push(setup);

      // Format css string
      for (var i = 0; i < leg.ref.css_array.length; i++) {

        // Easy reference
        var css_object = leg.ref.css_array[i];
        var selectors = css_object.selectors;
        var styles = css_object.styles;

        // Spacing if needed
        if(i > 0) {
          leg.ref.css += '\n\n';
        }

        // Selectors
        leg.ref.css += selectors.join('\n');

        // Starting bracket
        leg.ref.css += ' {';

        // Properties
        for (var attribute in styles) {
          if (styles.hasOwnProperty(attribute)) {
            leg.ref.css += '\n  ';
            leg.ref.css += attribute.replace(/_/g, '-') + ': ';
            leg.ref.css += styles[attribute] + ';';
          }
        }

        // Ending bracket
        leg.ref.css += '\n}';
      }

      leg.ref.style_container.text(leg.ref.css);
    },

    // Show css or demo
    toggle_css: function() {
      $('html').toggleClass('showing-css');
    }
  }


  //
  // Go go go!
  //
  jQuery(document).ready(function() {

    // Run all setup functions
    for (var fn in leg.init) {
      if (leg.init.hasOwnProperty(fn)) {
        leg.init[fn]();
      }
    }
  });


}(jQuery));