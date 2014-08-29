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
      leg.ref.css_formatted = '';
      leg.ref.css_array = {};
      leg.ref.style_container = $('.legible-css');
      leg.ref.controls = $('.controls');
    },

    // Build CSS at proper times
    build_css: function() {

      // On load
      leg.fn.hash_set_values();
      leg.fn.build_css();

      // On change
      leg.ref.controls.find('input').change(function(){
        leg.fn.build_css();
        leg.fn.hash_update();
      });

      // On input
      leg.ref.controls.find('input[type="range"]').on('input', function(){
        leg.fn.build_css();
        leg.fn.hash_update();
      });

      // On keyup
      leg.ref.controls.find('input[type="text"], input[type="number"]').keyup(function(){
        leg.fn.build_css();
        leg.fn.hash_update();
      });
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
      leg.ref.css_formatted = '';

      // Spacing and sizing
      leg.ref.css_array.push({
        selectors: ['.legible'],
        styles: {
          font_size: $('#font-size-range').val() + 'px',
          line_height: $('#line-height-range').val() + 'em'
        }
      });

      leg.ref.css_array.push({
        selectors: ['.legible h1', '.legible h2', '.legible h3', '.legible h4', '.legible h5', '.legible h6', '.legible div', '.legible p', '.legible ul', '.legible ol', '.legible blockquote', '.legible table', '.legible pre code'],
        styles: {
          margin_top: $('#block-spacing-range').val() + 'em'
        }
      });

      leg.ref.css_array.push({
        selectors: ['.legible h1 + *', '.legible h2 + *', '.legible h3 + *', '.legible h4 + *', '.legible h5 + *', '.legible h6 + *', '.legible *:first-child'],
        styles: {
          margin_top: '0'
        }
      });

      // Build css string
      for (var i = 0; i < leg.ref.css_array.length; i++) {

        // Reference
        var selectors = leg.ref.css_array[i].selectors;
        var styles = leg.ref.css_array[i].styles;

        // Selectors
        leg.ref.css += selectors.join(',');

        // Starting bracket
        leg.ref.css += '{';

        // Properties
        for (var attribute in styles) {
          if (styles.hasOwnProperty(attribute)) {
            leg.ref.css += attribute.replace(/_/g, '-') + ':';
            leg.ref.css += styles[attribute] + ';';
          }
        }

        // Ending bracket
        leg.ref.css += '}';
      }

      // Populate css
      leg.ref.css_formatted = leg.fn.format_css(leg.ref.css);
      leg.ref.style_container.text(leg.ref.css_formatted);
    },

    // Take ugly CSS string and make it look pretty.
    // Based on code from: https://raw.githubusercontent.com/mrcoles/cssunminifier/master/lib/cssunminifier.js
    // But modified to suit 040 CSS style
    format_css: function(code, tab) {
      var defaultTab = 2;
      var space = '';

      if (typeof tab == 'string') {
        tab = /^\d+$/.test(tab) ? parseInt(tab) : defaultTab;
      }

      if (typeof tab == 'undefined') {
        tab = defaultTab;
      }

      if (tab < 0) {
        tab = defaultTab;
      }

      code = code
        .split('\t').join('    ')
        .replace(/\s*{\s*/g, ' {\n    ')
        .replace(/;\s*/g, ';\n    ')
        .replace(/,\s*/g, ',\n')
        .replace(/[ ]*}\s*/g, '}\n')
        .replace(/\}\s*(.+)/g, '}\n\n$1')
        .replace(/\n    ([^:]+):\s*/g, '\n    $1: ')
        .replace(/([A-z0-9\)])}/g, '$1;\n}');

      if (tab != 4) {
        for (;tab != 0;tab--) { space += ' '; }
        code = code.replace(/\n    /g, '\n'+space);
      }

      return code;
    },

    // Show css or demo
    toggle_css: function() {
      $('html').toggleClass('showing-css');
    },

    // Update hash
    hash_update: function() {
      var hash_array = [];
      leg.ref.controls.find('.field-group > input').each(function(index){
        var value = $(this).val();
        hash_array.push(value);
      });
      var hash = hash_array.join('_');
      window.location.hash = hash;
    },

    // Set values from hash
    hash_set_values: function() {
      var hash = window.location.hash.replace('#', '');
      if(hash.length > 1) {
        var hash_array = hash.split('_');
        leg.ref.controls.find('.field-group > input').each(function(index){
          $(this).val(hash_array[index]);
        });
      }
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