'use strict';

/**
 * Prefix root-relative URLs authored in Markdown/raw HTML with Hexo's project
 * root. EJS templates should continue to use url_for(); this filter covers
 * rendered page content, where Hexo helpers are not available.
 */
hexo.extend.filter.register('after_render:html', function prefixProjectRoot(html) {
  const root = String(hexo.config.root || '/');
  if (root === '/') return html;

  const base = root.replace(/\/$/, '');
  const withRoot = function withRoot(path) {
    if (!path || path.indexOf('//') === 0 || path === base || path.indexOf(base + '/') === 0) return path;
    return base + path;
  };

  return String(html)
    .replace(/\b(href|src|action)=(['"])(\/(?!\/)[^'"]*)\2/g, function replaceAttribute(match, name, quote, path) {
      return name + '=' + quote + withRoot(path) + quote;
    })
    .replace(/(\burl=)(\/(?!\/)[^\s"'>;]*)/gi, function replaceRefresh(match, prefix, path) {
      return prefix + withRoot(path);
    });
});
