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
      leg.ref.el.controls.find('input, select').change(function(){
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

        // On init
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

        // On change on text
        input.change(function(e){
          var val = $(this).val();
          range.val(val);
          range.trigger('change');
        });
      });
    },

    // Other interactions
    buttons: function() {
      $('.toggle-css').click(function(e){
        leg.fn.toggle_css();
        e.preventDefault();
      });
      $('.toggle-grid').click(function(e){
        leg.fn.toggle_grid();
        e.preventDefault();
      });
    }
  }


  //
  // Functions
  // 
  leg.fn = {

    // Toggle css
    toggle_css: function() {
      $('html').toggleClass('showing-css');
    },

    // Toggle css
    toggle_grid: function() {
      $('html').toggleClass('showing-grid');
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

      // Base value reference
      var line_height = parseFloat($('#line-height-range').val());
      var font_size_px = parseFloat($('#font-size-range').val());
      var line_height_px = Math.round(font_size_px * line_height);
      var line_height_em = line_height_px / font_size_px;

      var h_scale = parseFloat($('#h-scale-range').val());
      var h_padding = parseFloat($('#h-padding-range').val());
      var h_block_spacing = parseFloat($('#h-block-spacing').val());

      var block_spacing = $('#block-spacing-range').val();
      var block_spacing_px = block_spacing * line_height_px;
      var block_spacing_em = parseFloat(block_spacing_px / font_size_px);
      var block_spacing_after_header_em = parseFloat(h_block_spacing * block_spacing_em);

      var h1_size = parseFloat($('#h1-size').val());
      var h1_font_weight = parseFloat($('#h1-font-weight').val());
      var h1_font_size_px = Math.round(Math.pow(h_scale, h1_size) * font_size_px);
      var h1_number_of_lines = Math.ceil(h1_font_size_px / line_height_px);
      var h1_line_height_px = line_height_px * h1_number_of_lines;
      var h1_font_size_em = parseFloat(h1_font_size_px/font_size_px);
      var h1_line_height_em = parseFloat(h1_line_height_px/h1_font_size_px)
      var h1_margin_top = parseFloat((line_height_px / h1_font_size_px) * block_spacing);
      var h1_padding = parseFloat((line_height_px / h1_font_size_px) * h_padding);

      var h2_size = parseFloat($('#h2-size').val());
      var h2_font_weight = parseFloat($('#h2-font-weight').val());
      var h2_font_size_px = Math.round(Math.pow(h_scale, h2_size) * font_size_px);
      var h2_number_of_lines = Math.ceil(h2_font_size_px / line_height_px);
      var h2_line_height_px = line_height_px * h2_number_of_lines;
      var h2_font_size_em = parseFloat(h2_font_size_px/font_size_px);
      var h2_line_height_em = parseFloat(h2_line_height_px/h2_font_size_px);
      var h2_margin_top = parseFloat((line_height_px / h2_font_size_px));
      var h2_padding = parseFloat((line_height_px / h2_font_size_px) * h_padding);

      var h3_size = parseFloat($('#h3-size').val());
      var h3_font_weight = parseFloat($('#h3-font-weight').val());
      var h3_font_size_px = Math.round(Math.pow(h_scale, h3_size) * font_size_px);
      var h3_number_of_lines = Math.ceil(h3_font_size_px / line_height_px);
      var h3_line_height_px = line_height_px * h3_number_of_lines;
      var h3_font_size_em = parseFloat(h3_font_size_px/font_size_px);
      var h3_line_height_em = parseFloat(h3_line_height_px/h3_font_size_px);
      var h3_margin_top = parseFloat((line_height_px / h3_font_size_px) * block_spacing);
      var h3_padding = parseFloat((line_height_px / h3_font_size_px) * h_padding);

      var h4_font_weight = parseFloat($('#h4-font-weight').val());

      var list_style_position = $('#list-style-position').val();
      var list_margin_left_em = $('#list-margin-left-range').val();
      var list_margin_left_px = Math.round(list_margin_left_em * font_size_px);
      var list_ul_bullet_type = $('#list-ul-bullet-type').val();
      var list_ol_bullet_type = $('#list-ol-bullet-type').val();

      var blockquote_size = parseFloat($('#blockquote-size').val());
      var blockquote_font_size_px = Math.round(Math.pow(h_scale, blockquote_size) * font_size_px);
      var blockquote_number_of_lines = Math.ceil(blockquote_font_size_px / line_height_px);
      var blockquote_line_height_px = blockquote_number_of_lines * line_height_px;
      
      var blockquote_font_size_em = parseFloat(blockquote_font_size_px/font_size_px);
      var blockquote_line_height_em = parseFloat(blockquote_line_height_px/blockquote_font_size_px);
      var blockquote_one_line_em = line_height_px / blockquote_font_size_px;
      var blockquote_margin_top = parseFloat(blockquote_one_line_em * block_spacing);
      var blockquote_font_weight = $('#blockquote-font-weight').val();
      var blockquote_font_style = $('#blockquote-font-style').val();
      var blockquote_background_color = $('#blockquote-background-color').val();
      var blockquote_color = $('#blockquote-color').val();
      var blockquote_margin_left_em = $('#blockquote-margin-left-range').val();
      var blockquote_padding = $('#blockquote-padding-range').val();
      var blockquote_padding_em = blockquote_one_line_em * blockquote_padding;

      var b_font_weight = $('#b-font-weight').val();
      var code_background_color = $('#code-background-color').val();
      var code_color = $('#code-color').val();

      // Support - visualize some numbers to make it easier to set stuff
      $('.line-height-px').text(line_height_px);

      // Support css, helps seeing things but shouldn't be added to legible
      leg.ref.css.support_array.push({
        selectors: ['.legible-test'],
        styles: {
          font_size: font_size_px + 'px',
          line_height: line_height_em + 'em',
          background_size: '100%' + ' ' + line_height_em * 2 + 'em'
        }
      });

      leg.ref.css.support_array.push({
        selectors: ['.legible-test .wrapper'],
        styles: {
          padding: line_height_em + 'em 40px'
        }
      });

      // Spacing and sizing
      leg.ref.css.legible_array.push({
        comment: 'Sizes and spacing',
        selectors: ['.legible'],
        styles: {
          font_size: font_size_px + 'px',
          line_height: line_height_em + 'em'
        }
      });

      leg.ref.css.legible_array.push({
        selectors: ['.legible h1', '.legible h2', '.legible h3', '.legible h4', '.legible h5', '.legible h6', '.legible div', '.legible p', '.legible ul', '.legible ol', '.legible blockquote', '.legible table', '.legible pre code:first-child'],
        styles: {
          margin_top: block_spacing_em + 'em'
        }
      });

      leg.ref.css.legible_array.push({
        selectors: ['.legible *:first-child'],
        styles: {
          margin_top: '0'
        }
      });

      leg.ref.css.legible_array.push({
        selectors: ['.legible h1 + *', '.legible h2 + *', '.legible h3 + *', '.legible h4 + *', '.legible h5 + *', '.legible h6 + *'],
        styles: {
          margin_top: block_spacing_after_header_em + 'em'
        }
      });

      // Headers
      leg.ref.css.legible_array.push({
        comment: 'Headers',
        selectors: ['.legible h1'],
        styles: {
          font_size: h1_font_size_em + 'em',
          line_height: h1_line_height_em + 'em',
          font_weight: h1_font_weight,
          margin_top: h1_margin_top + 'em',
          padding_top: h1_padding + 'em',
          padding_bottom: h1_padding + 'em'
        }
      });

      leg.ref.css.legible_array.push({
        selectors: ['.legible h2'],
        styles: {
          font_size: h2_font_size_em + 'em',
          line_height: h2_line_height_em + 'em',
          font_weight: h2_font_weight,
          margin_top: h2_margin_top + 'em',
          padding_top: h2_padding + 'em',
          padding_bottom: h2_padding + 'em'
        }
      });

      leg.ref.css.legible_array.push({
        selectors: ['.legible h3'],
        styles: {
          font_size: h3_font_size_em + 'em',
          line_height: h3_line_height_em + 'em',
          font_weight: h3_font_weight,
          margin_top: h3_margin_top + 'em',
          padding_top: h3_padding + 'em',
          padding_bottom: h3_padding + 'em'
        }
      });

      leg.ref.css.legible_array.push({
        selectors: ['.legible h4'],
        styles: {
          font_weight: h4_font_weight
        }
      });

      leg.ref.css.legible_array.push({
        selectors: ['.legible h5'],
        styles: {
          font_weight: h4_font_weight,
          font_style: 'italic'
        }
      });

      leg.ref.css.legible_array.push({
        selectors: ['.legible h6'],
        styles: {
          font_style: 'italic'
        }
      });

      // Lists
      leg.ref.css.legible_array.push({
        comment: 'Lists',
        selectors: ['.legible ul', '.legible ol'],
        styles: {
          list_style_position: list_style_position,
          margin_left: list_margin_left_em + 'em',
          padding_left: '0'
        }
      });

      leg.ref.css.legible_array.push({
        selectors: ['.legible ul'],
        styles: {
          list_style_type: list_ul_bullet_type
        }
      });

      leg.ref.css.legible_array.push({
        selectors: ['.legible ol'],
        styles: {
          list_style_type: list_ol_bullet_type
        }
      });

      // Quotes/bolds/italics and other emphasis
      leg.ref.css.legible_array.push({
        comment: 'Quotes/bolds/italics and other emphasis',
        selectors: ['.legible b', '.legible strong'],
        styles: {
          font_weight: b_font_weight
        }
      });

      leg.ref.css.legible_array.push({
        selectors: ['.legible i', '.legible em'],
        styles: {
          font_style: 'italic'
        }
      });

      leg.ref.css.legible_array.push({
        selectors: ['.legible code'],
        styles: {
          vertical_align: 'bottom',
          font_family: "'Monaco', Courier, 'Courier New', monospace",
          background_color: code_background_color,
          color: code_color
        }
      });

      leg.ref.css.legible_array.push({
        selectors: ['.legible pre code'],
        styles: {
          display: 'block'
        }
      });

      leg.ref.css.legible_array.push({
        selectors: ['.legible blockquote'],
        styles: {
          font_size: blockquote_font_size_em + 'em',
          line_height: blockquote_line_height_em + 'em',
          margin_top: blockquote_margin_top + 'em',
          font_weight: blockquote_font_weight,
          font_style: blockquote_font_style,
          margin_left: blockquote_margin_left_em + 'em',
          padding: blockquote_padding_em + 'em',
          color: blockquote_color,
          background_color: blockquote_background_color
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
    //   comment: '',
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
        var comment = css_object.comment;

        // Comment
        if(comment != undefined) {
          css_string += '/*' + comment + '*/';
        }

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
    format_css: function(css, tab) {
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

      css = css
        .split('\t').join('    ')
        .replace(/\/\*/g, '/* ')
        .replace(/\*\//g, ' */\n')
        .replace(/\s*{\s*/g, ' {\n    ')
        .replace(/;\s*/g, ';\n    ')
        .replace(/,/g, ',\n')
        .replace(/(,\n\s)/g, ', ')
        .replace(/[ ]*}\s*/g, '}\n')
        .replace(/\}\s*(.+)/g, '}\n\n$1')
        .replace(/\n    ([^:]+):\s*/g, '\n    $1: ')
        .replace(/([A-z0-9\)])}/g, '$1;\n}');

      if (tab != 4) {
        for (;tab != 0;tab--) { space += ' '; }
        css = css.replace(/\n    /g, '\n'+space);
      }

      return css;
    },

    // Update hash
    hash_update: function() {
      var hash_array = [];
      leg.ref.el.controls.find('.field-group > input, .field-group > select').each(function(index){
        var value = $(this).val().replace('#', '-');
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
        leg.ref.el.controls.find('.field-group > input, .field-group > select').each(function(index){
          $(this).val(hash_array[index].replace('-', '#'));
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