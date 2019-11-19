import urllib.request, json
from pprint import pprint
url = "http://localhost:3000/api/Countries/Country/India"
response = urllib.request.urlopen(url)
data = json.loads(response.read())
pprint(data)