#!/usr/bin/env python

import requests
import datetime
import time

SITE_ROOT = "http://rcmdnk.github.io"
URL_LIST = SITE_ROOT + "/urllist.html"
MAX_TRY = 100
WAIT_TIME = 300

print "Start at %s" % datetime.datetime.today()

urls = requests.get(URL_LIST).text.split()
n = len(urls)

print "Total %d urls" % n

shares = {}

for u in urls:
    print "%d urls remaining..." % n
    n -= 1
    for i in xrange(MAX_TRY):
        if i != 0:
            print "Waiting %d times" % i
        f = requests.get("http://graph.facebook.com/?id=%s%s" % (SITE_ROOT, u))
        j = f.json()
        if "share" in j:
            shares[u] = j["share"]["share_count"]
            break
        time.sleep(WAIT_TIME)

with open("facebookshare.txt") as f:
    for u in shares:
        f.write("%s %s\n" % (u, shares[u]))

print "End at %s" % datetime.datetime.today()
