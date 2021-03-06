// Generated by CoffeeScript 1.9.3
(function() {
  var addSpace, log,
    slice = [].slice;

  log = function() {
    var args;
    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    return console.log.apply(console, ['TNSPC:'].concat(slice.call(args)));
  };

  addSpace = function(space, selector) {
    var lastIndex, matches, newSelector, regex;
    lastIndex = 0;
    newSelector = '';
    regex = new RegExp('(#|\\.)%', 'g');
    while ((matches = regex.exec(selector))) {
      newSelector += selector.slice(lastIndex, matches.index) + matches[1] + space + '-';
      lastIndex = regex.lastIndex;
    }
    newSelector += selector.slice(lastIndex);
    return newSelector;
  };

  module.exports = function(teacup) {
    var originalMethods, spaceRegex;
    originalMethods = null;
    (function() {
      var isSelector, parseSelector, render, renderContents;
      render = teacup.render, renderContents = teacup.renderContents, isSelector = teacup.isSelector, parseSelector = teacup.parseSelector;
      return originalMethods = {
        render: render,
        renderContents: renderContents,
        isSelector: isSelector,
        parseSelector: parseSelector
      };
    })();
    teacup.render = function() {
      var args, ref, template;
      template = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
      teacup.tn_namespace = null;
      teacup.tn_spaceStack = [''];
      return (ref = originalMethods.render).call.apply(ref, [teacup, template].concat(slice.call(args)));
    };
    teacup.renderContents = function() {
      var contents, namespace, ref, rest;
      contents = arguments[0], rest = 2 <= arguments.length ? slice.call(arguments, 1) : [];
      namespace = teacup.tn_namespace;
      teacup.tn_namespace = null;
      if (namespace) {
        teacup.tn_spaceStack.push(namespace);
      }
      (ref = originalMethods.renderContents).call.apply(ref, [teacup, contents].concat(slice.call(rest)));
      if (namespace) {
        return teacup.tn_spaceStack.pop();
      }
    };
    teacup.isSelector = function(string) {
      var ref;
      teacup.tn_namespace = null;
      return string.length > 1 && ((ref = string.charAt(0)) === '#' || ref === '.' || ref === '%');
    };
    spaceRegex = new RegExp('^%([^#.]+)', 'g');
    return teacup.parseSelector = function(selector) {
      var origSel, parts, space;
      origSel = selector;
      space = ((parts = spaceRegex.exec(selector)) ? (teacup.tn_namespace = parts[1]) : teacup.tn_spaceStack[teacup.tn_spaceStack.length - 1]);
      selector = selector.replace(spaceRegex, '');
      if (space) {
        selector = addSpace(space, selector);
      }
      return originalMethods.parseSelector.call(teacup, selector);
    };
  };

}).call(this);
