# Conversion of JSON data to dictionary

# importing the module
import json
import yaml

# files
YAML_FILE = '/Users/pabloglez/code/TFG/2021-2022/tfg-iaas-backend/src/files/pabloTFG.yaml'
JSON_FILE = '/Users/pabloglez/code/TFG/2021-2022/tfg-iaas-backend/src/files/vars.json'

# opening and writing files
with open(YAML_FILE, 'w+') as yaml_file , open(JSON_FILE, 'r') as json_file:
  json_load = json.load(json_file)
  yaml.dump(json_load, yaml_file)
