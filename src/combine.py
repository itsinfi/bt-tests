import json
import sys

def merge_results(file_paths):
    merged_results = []

    for file_path in file_paths:
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                data = json.load(file)
                results = data.get('root_group', {}).get('groups', [])
                merged_results.extend(results)
        except Exception as e:
            print(f'{file_path}: {e}')
        
    return {'root_group': {'groups': merged_results}}
    
def save_json(result, output_file):
    try:
        with open(output_file, 'w', encoding='utf-8') as file:
            json.dump(result, file, indent=2, ensure_ascii=False)
    except Exception as e:
        print(e)
    
if __name__ == '__main__':
    if len(sys.argv) < 3:
        print('python combine.py <output.json> <datei1.json> <datei2.json> ...')
        sys.exit(1)
    
    output_file = sys.argv[1]
    input_files = sys.argv[2:]

    result = merge_results(input_files)

    save_json(result, output_file)