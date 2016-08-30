#!/usr/bin/env python

import requests
import datetime
import time
import re

SITE_ROOT = "http://rcmdnk.github.io"
URL_LIST = SITE_ROOT + "/urllist.html"
MAX_TRY = 100
WAIT_TIME = 300
URL_PATTERNS = ["/blog/20\d\d/\d\d/\d\d/.+"]

print "Start at %s" % datetime.datetime.today()

patterns = [re.compile(r"%s" % x) for x in URL_PATTERNS]
urls_tmp = requests.get(URL_LIST).text.split()
urls = []
for u in urls_tmp:
    for p in patterns:
        if p.match(u):
            urls.append(u)
            break

n = len(urls)

print "Total %d urls" % n

shares = {}

for u in urls:
    if u == "/404.html":
        break
    print "%d urls remaining..." % n
    n -= 1
    for i in xrange(MAX_TRY):
        if i != 0:
            print "Waiting %d times" % i
        try:
            print "http://graph.facebook.com/?id=%s%s" % (SITE_ROOT, u)
            f = requests.get("http://graph.facebook.com/?id=%s%s"
                             % (SITE_ROOT, u))
            j = f.json()
            if "share" in j:
                shares[u] = j["share"]["share_count"]
                break
        except:
            print "Can't get json for %s" % u

        print 'waiting..'
        time.sleep(WAIT_TIME)

with open("facebookshare.txt") as f:
    for u in shares:
        f.write("%s %s\n" % (u, shares[u]))

print "End at %s" % datetime.datetime.today()
