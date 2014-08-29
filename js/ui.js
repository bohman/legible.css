(function($) {


  //
  // Setup
  //
  window.leg = {
    ref: {
      css: {},
      el: {}
    }
  }


  //
  // Init functions
  // 
  leg.init = {

    // References
    references: function() {

      // CSS
      leg.ref.css.legible = '';
      leg.ref.css.legible_formatted = '';
      leg.ref.css.legible_array = {};
      leg.ref.css.support = '';
      leg.ref.css.support_array = '';

      // Elements
      leg.ref.el.legible_css = $('.legible-css');
      leg.ref.el.support_css = $('.support-css');
      leg.ref.el.controls = $('.controls');
    },

    // Build CSS at proper times
    build_css: function() {

      // On load
      leg.fn.hash_set_values();
      leg.fn.build_css();

      // On change
      leg.ref.el.controls.find('input').change(function(){
        leg.fn.build_css();
        leg.fn.hash_update();
      });

      // On input
      leg.ref.el.controls.find('input[type="range"]').on('input', function(){
        leg.fn.build_css();
        leg.fn.hash_update();
      });

      // On keyup
      leg.ref.el.controls.find('input[type="text"], input[type="number"]').keyup(function(){
        leg.fn.build_css();
        leg.fn.hash_update();
      });
    },

    // Sync range and inputs
    sync: function() {
      leg.ref.el.controls.find('input[type="range"]').each(function(){
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

    // Show css or demo
    toggle_css: function() {
      $('html').toggleClass('showing-css');
    },

    // Build CSS: grab values entered in controls,
    // do whatever calculations needed and update styles.
    build_css: function() {

      // Resetting
      leg.ref.css.legible_array = [];
      leg.ref.css.legible = '';
      leg.ref.css.legible_formatted = '';
      leg.ref.css.support_array = [];
      leg.ref.css.support = '';

      // Spacing and sizing
      leg.ref.css.support_array.push({
        selectors: ['.legible-test'],
        styles: {
          background_size: '100%' + ' ' + parseFloat($('#line-height-range').val() * 2) + 'em',
          padding: $('#line-height-range').val() + 'em 40px'
        }
      });

      leg.ref.css.legible_array.push({
        selectors: ['.legible'],
        styles: {
          font_size: $('#font-size-range').val() + 'px',
          line_height: $('#line-height-range').val() + 'em'
        }
      });

      leg.ref.css.legible_array.push({
        selectors: ['.legible h1', '.legible h2', '.legible h3', '.legible h4', '.legible h5', '.legible h6', '.legible div', '.legible p', '.legible ul', '.legible ol', '.legible blockquote', '.legible table', '.legible pre code'],
        styles: {
          margin_top: $('#block-spacing-range').val() + 'em'
        }
      });

      leg.ref.css.legible_array.push({
        selectors: ['.legible h1 + *', '.legible h2 + *', '.legible h3 + *', '.legible h4 + *', '.legible h5 + *', '.legible h6 + *', '.legible *:first-child'],
        styles: {
          margin_top: '0'
        }
      });

      // Lists
      leg.ref.css.legible_array.push({
        selectors: ['.legible ul', '.legible ol'],
        styles: {
          margin_left: $('#list-margin-range').val() + 'px',
          padding_left: $('#list-padding-range').val() + 'px'
        }
      });

      // Build css strings
      for (var i = 0; i < leg.ref.css.legible_array.length; i++) {
        var css_object = leg.ref.css.legible_array[i];
        leg.ref.css.legible += leg.fn.build_css_from_object(css_object);
      }

      for (var i = 0; i < leg.ref.css.support_array.length; i++) {
        var css_object = leg.ref.css.support_array[i];
        leg.ref.css.support += leg.fn.build_css_from_object(css_object);
      }

      // Populate css
      leg.ref.css.legible_formatted = leg.fn.format_css(leg.ref.css.legible);
      leg.ref.el.legible_css.text(leg.ref.css.legible_formatted);
      leg.ref.el.support_css.text(leg.ref.css.support);
    },

    // Give this function a CSS object and it'll return a css string.
    // A CSS object look like this:
    // {
    //   selectors: [],
    //   styles: { attribute: 'value' }
    // }
    // You need to switch - for _ in attributes, but otherwise it's all good.
    build_css_from_object: function(css_object) {
      var css_string = '';
      if(css_object != undefined) {

        // Reference
        var selectors = css_object.selectors;
        var styles = css_object.styles;

        // Selectors
        css_string += selectors.join(',');

        // Starting bracket
        css_string += '{';

        // Properties
        for (var attribute in styles) {
          if (styles.hasOwnProperty(attribute)) {
            css_string += attribute.replace(/_/g, '-') + ':';
            css_string += styles[attribute] + ';';
          }
        }

        // Ending bracket
        css_string += '}';
      }
      return css_string;
    },

    // Take ugly CSS string and make it look pretty.
    // Based on code from: https://raw.githubusercontent.com/mrcoles/cssunminifier/master/lib/cssunminifier.js but modified to suit 040 CSS style
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

    // Update hash
    hash_update: function() {
      var hash_array = [];
      leg.ref.el.controls.find('.field-group > input').each(function(index){
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
        leg.ref.el.controls.find('.field-group > input').each(function(index){
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