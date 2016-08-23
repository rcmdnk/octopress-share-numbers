require "json"
require "open-uri"
require "parallel"
require "ruby-progressbar"

module Jekyll

  class ShareNumbers < Generator
    safe :true
    priority :high

    def get_number(api, format='non', val='non', remove=nil)
      begin
        open(api) do |f|
          content = f.read
          if remove != nil
            if remove.is_a? String
              remove = [remove]
            end
            remove.each do |r|
              content.gsub!(r, '')
            end
          end
          case format
          when 'json'
            JSON.parse(content)[val]
          when 'jsonfull'
            JSON.parse(content)
          when 'html'
            content.match(val) ? content.match(val)[1] : 0
          else
            content
          end
        end
      rescue
        0
      end
    end

    def get_hatebu(url)
      get_number('http://api.b.st-hatena.com/entry.count?url=' + url).to_i
    end

    def get_twitter(url)
      #get_number('http://urls.api.twitter.com/1/urls/count.json?url=' + url, 'json', 'count').to_i
      get_number('http://jsoon.digitiminimi.com/twitter/count.json?url=' + url, 'json', 'count').to_i
    end

    def get_googleplus(url)
      get_number('https://plusone.google.com/_/+1/fastbutton?url=' + url,
                 'html', /window\.__SSR = {c: ([\d]+)/).to_i
    end

    def get_facebook(url)
      h = get_number('https://graph.facebook.com/?id=' + url, 'jsonfull')
      if h.class == Hash and h.key?('share')
        h['share']["share_count"].to_i
      else
        0
      end
    end

    def get_pocket(url)
      get_number('https://widgets.getpocket.com/v1/button?label=pocket&count=vertical&v=1&url=' + url,
                 'html', /<em id="cnt">(\d+)<\/em>/).to_i
    end

    def get_linkedin(url)
      get_number('https://www.linkedin.com/countserv/count/share?format=json&url=' + url, 'json', 'count').to_i
    end

    def get_stumble(url)
      h = get_number('https://www.stumbleupon.com/services/1.01/badge.getinfo?url=' + url, 'jsonfull')
      begin
        h['result']['views'].to_i
      rescue
        0
      end
    end

    def get_pinterest(url)
      get_number('https://api.pinterest.com/v1/urls/count.json?url=' + url, 'json', 'count', ['receiveCount(',')']).to_i
    end

    def get_buffer(url)
      get_number('https://api.bufferapp.com/1/links/shares.json?url=' + url, 'json', 'shares').to_i
    end

    def get_delicious(url)
      h = get_number('https://feeds.delicious.com/v2/json/urlinfo/data?url=' + url, 'jsonfull')
      begin
        h[0]['total_posts'].to_i
      rescue
        0
      end
    end

    def method_missing(method, *args)
      nil
    end

    def get_shares(page, config, m)
      url = config['url'] + page.url
      shares = ['hatebu', 'twitter', 'googleplus', 'facebook', 'pocket',
                'linkedin', 'stumble', 'pinterest', 'buffer', 'delicious']
      if not config['share_check_all']
        shares = config.select{|key, val| key.is_a?(String) and key.end_with?('_button') and val == true}.keys
      end
      shares.each do |button|
        name = button.sub('_button', '')
        count = name + 'Count'
        n = self.send('get_' + name, url)
        if n != nil
          m.synchronize do
            page.data.merge!(count => n)
            if config[count]
              config[count] += n
            else
              config[count] = n
            end
          end
        end
      end
    end

    def generate(site)
      if !site.config['share_static'] or (!site.config['share_official'] and !site.config['share_custom'])
        return
      end

      m = Mutex.new
      Parallel.map([site.posts, site.pages].flatten, :in_threads => site.config['n_cores'] ? site.config['n_cores'] : 1) do |page_or_post|
        get_shares(page_or_post, site.config, m)
      end
    end
  end
end
