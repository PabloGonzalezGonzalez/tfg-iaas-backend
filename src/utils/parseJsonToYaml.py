# Conversion of JSON data to dictionary

# importing the module
import json
import yaml

# opening files
yaml_file = open('/home/pablogonzlezgonzlez/Documents/tfg/src/files/pabloTFG.yaml', 'w+')
json_file = open('/home/pablogonzlezgonzlez/Documents/tfg/src/files/vars.json', 'r')

yaml_file.write(yaml.dump(json.load(json_file)))