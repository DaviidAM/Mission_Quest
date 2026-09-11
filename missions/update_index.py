import os
import json

MISSIONS_DIR = os.path.dirname(os.path.abspath(__file__))
CUSTOM_MISSIONS_DIR = os.path.join(MISSIONS_DIR, 'list')
INDEX_FILE = os.path.join(MISSIONS_DIR, 'index.json')

# List all .json files except index.json
custom_missions = [f for f in os.listdir(CUSTOM_MISSIONS_DIR) if f.endswith('.json') ]

# Write the list of file names to index.json
with open(INDEX_FILE, 'w', encoding='utf-8') as f:
    json.dump(custom_missions, f, ensure_ascii=False, indent=2)

print(f" >>> index.json updated with {len(custom_missions)} mission filenames.")
