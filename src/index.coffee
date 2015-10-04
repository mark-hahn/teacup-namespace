
log = (args...) -> console.log 'TNSPC:', args...

addSpace = (space, selector) ->
  lastIndex   = 0
  newSelector = ''
  regex = new RegExp '(#|\\.)%', 'g'
  while (matches = regex.exec selector)
    newSelector += selector[lastIndex...matches.index] + 
                   matches[1] + space + '-'
    {lastIndex}  = regex
  newSelector += selector[lastIndex...]
  newSelector

module.exports = (teacup) ->
  # (teacup) ->
    originalMethods = null
    do ->
      {render, renderContents, isSelector, parseSelector} = teacup
      originalMethods = {render, renderContents, isSelector, parseSelector}
    
    teacup.render = (template, args...) ->
      teacup.tn_namespace  = null
      teacup.tn_spaceStack = ['']
      originalMethods.render.call teacup, template, args...
    
    teacup.renderContents = (contents, rest...) ->
      namespace = teacup.tn_namespace
      teacup.tn_namespace = null
      teacup.tn_spaceStack.push namespace if namespace
      # log 'renderContents', namespace, teacup.tn_spaceStack
      originalMethods.renderContents.call teacup, contents, rest...
      teacup.tn_spaceStack.pop() if namespace
    
    teacup.isSelector = (string) ->
      teacup.tn_namespace = null
      string.length > 1 and string.charAt(0) in ['#', '.', '%']

    spaceRegex = new RegExp '^%([^#.]+)', 'g'
    teacup.parseSelector = (selector) ->
      origSel = selector
      space = (if (parts = spaceRegex.exec selector) \
                 then                                \
                   (teacup.tn_namespace = parts[1])  \
                 else                                \
                   teacup.tn_spaceStack[teacup.tn_spaceStack.length-1])
      selector = selector.replace spaceRegex, ''
      if space then selector = addSpace space, selector
      # log 'parseSelector', origSel, selector, space, teacup.tn_namespace, teacup.tn_spaceStack
      originalMethods.parseSelector.call teacup, selector
