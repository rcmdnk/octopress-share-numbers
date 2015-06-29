# octopress-share-numbers

Set social buttons and get share numbers.

Available social buttons are:

* [Hatena Bookmark](http://b.hatena.ne.jp/)
* [Twitter](https://twitter.com/)
* [Google+](https://plus.google.com/)
* [Facebook](https://www.facebook.com/)
* [Pocket](https://getpocket.com/)
* [LinkedIn](https://www.linkedin.com/)
* [StumbleUpon](https://www.stumbleupon.com/)
* [Pinterest](https://pinterest.com/)
* [Buffer](https://buffer.com/) (not in sharing.html)
* [Delicious](https://delicious.com/) (currently count is not available)
* [Tumblr](https://www.tumblr.com/) (Only button w/o cound)

## Requirement

To use active mode with JavaScript,
please install
[rcmdnk/jekyll-var-to-js](https://github.com/rcmdnk/jekyll-var-to-js), too.

## Installation

There are three methods:

* Official API for buttons.
    * Copy **source/_includes/post/sharing.html** (extended sharing buttons file of Octopress)
    to your **source/_includes/post/**.
* Custom buttons, getting numbers actively by JavaScript.
    * Copy **source/_includes/post/sharing_custom.html**.
    to your **source/_includes/post/**.
    * Copy **source/javascripts/share-custom.js** to your **soruce/javascripts/**.
* Custom buttons, getting numbers statically by the plugin.
    * Copy **source/_includes/post/sharing_custom.html**.
    to your **source/_includes/post/**.
    * Copy **plugins/share-numbers.rb** to your **plugins**.

Copy **sass/plugins/_share-numbers.scss** to you **sass/plugins/**.

## Usage


Put **share-custom.js** in **source/_includes/head.html**, after jQuery (**share-custom.js** uses jQuery):

    {%unless site.share_static%}<script src="{{root_url}}/javascripts/compressed/share-custom.js"></script>{%endunless%}

Put **sharing_custom.html** in such **source/_layouts/post.html**,
like:

```diff
 </p>
 {% unless page.sharing == false %}
+{% unless site.share_official == false %}
   {% include post/sharing.html %}
 {% endunless %}
+{% if site.share_custom == true %}
+{% include post/sharing_custom.html %}
+{% endif %}
+{% endunless %}
 <p class="meta">
```

And set your configuration in **_config.yml**:


    # CPUs for parallel jobs
    n_cores: 4
    
    # Choose method
    share_official: false
    share_custom: true
    share_static: true
    share_check_all: false
    
    # Select shares
    hatebu_button: true
    twitter_button: true
    googleplus_button: true
    facebook_button: true
    pocket_button: true
    linkedin_button: false
    stumble_button: false
    pinterest_button: false
    buffer_button: false
    delicious_button: false
    tumblr_button: false
    
    # jekyll-var
    jekyll_var:
      include:
        - hatebu_button
        - twitter_button
        - googleplus_button
        - facebook_button
        - pocket_button
        - linkedin_button
        - stumble_button
        - pinterest_button
        - buffer_button
        - delicious_button
        - share_check_all


First, choose method:

* Official API for buttons.
    * Set `share_official: true`.
    * Set `share_custom: false`.
* Custom buttons, getting numbers actively by JavaScript.
    * Set `share_official: false`.
    * Set `share_custom: true`.
    * Set `share_static: false`.
* Custom buttons, getting numbers statically by the plugin.
    * Set `share_official: false`.
    * Set `share_custom: true`.
    * Set `share_static: true`.

If `share_check_all` is enabled,
the plugin gets numbers for all shares
and store to the memory.
But only buttons which are enabled are shown in **sharing_custom.html**.
(Useful if you want to use in other places.)

`n_cores` is used in the plugin, to decide how many threads should run.
