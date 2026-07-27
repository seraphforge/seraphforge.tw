'use strict';

const fs = require('fs');
const path = require('path');

function flagIsFalse(value) {
  return value === false || value === 'false' || value === 0 || value === '0';
}

function flagIsTrue(value) {
  return value === true || value === 'true' || value === 1 || value === '1';
}

function shouldShowPost(post, surface) {
  post = post || {};
  surface = surface || 'list';

  if (flagIsTrue(post.archive_only)) return false;
  if (surface === 'featured' && flagIsFalse(post.featured)) return false;
  if ((surface === 'list' || surface === 'home' || surface === 'archive' || surface === 'tag') && flagIsFalse(post.show_in_list)) return false;

  return true;
}

function shouldIndexPost(post) {
  post = post || {};
  if (flagIsTrue(post.archive_only)) return false;
  if (flagIsFalse(post.indexing)) return false;
  if (flagIsTrue(post.noindex)) return false;
  return true;
}

function postPathVariants(post) {
  const variants = new Set();
  const add = function(value) {
    if (!value) return;
    const clean = String(value).replace(/\\/g, '/').replace(/^\/+/, '').replace(/index\.html$/, '');
    variants.add(clean);
    variants.add(clean.replace(/\/$/, ''));
  };

  add(post.path);
  add(post.permalink && String(post.permalink).replace(/^https?:\/\/[^/]+\//, ''));
  return variants;
}

hexo.extend.helper.register('seraph_should_show_post', shouldShowPost);
hexo.extend.helper.register('seraph_should_index_post', shouldIndexPost);

hexo.extend.filter.register('after_generate', function() {
  const posts = this.locals.get('posts');
  if (!posts || !posts.length) return;

  const excludedPaths = [];
  posts.forEach(function(post) {
    if (shouldShowPost(post, 'list') && shouldIndexPost(post)) return;
    excludedPaths.push(...postPathVariants(post));
  });

  if (!excludedPaths.length) return;

  const searchPath = path.join(this.public_dir, 'search.json');
  if (fs.existsSync(searchPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(searchPath, 'utf8'));
      if (Array.isArray(data)) {
        const filtered = data.filter(function(item) {
          const target = String(item.url || item.path || item.permalink || '').replace(/^https?:\/\/[^/]+\//, '').replace(/^\/+/, '').replace(/index\.html$/, '');
          return !excludedPaths.some(function(excluded) {
            return target === excluded || target === excluded + '/' || target.indexOf(excluded + '/') >= 0;
          });
        });

        fs.writeFileSync(searchPath, JSON.stringify(filtered, null, 2));
      }
    } catch (error) {
      this.log.warn('Unable to filter search.json with Seraph content controls: %s', error.message);
    }
  }

  const feedPath = path.join(this.public_dir, 'feed.xml');
  if (fs.existsSync(feedPath)) {
    try {
      const feed = fs.readFileSync(feedPath, 'utf8');
      const filteredFeed = feed.replace(/<entry>[\s\S]*?<\/entry>/g, function(entry) {
        const normalizedEntry = entry.replace(/^https?:\/\/[^/]+\//gm, '').replace(/index\.html/g, '');
        const shouldRemove = excludedPaths.some(function(excluded) {
          return normalizedEntry.indexOf(excluded) >= 0;
        });
        return shouldRemove ? '' : entry;
      });
      fs.writeFileSync(feedPath, filteredFeed);
    } catch (error) {
      this.log.warn('Unable to filter feed.xml with Seraph content controls: %s', error.message);
    }
  }
});
