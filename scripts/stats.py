from datetime import datetime
import json
import matplotlib.pyplot as plt
import os

JSON_FOLDER= 'results/'
JSON_FILE = 'final.json'
FILTERS = []

THREAD_MODE = ' (M)'

COLORS = ["#F8DF54", "#70B851", "#546CF8", "#F85454"]

APPLICATIONS = {
    '3000': 'Express.js',
    '3001': 'Fastify',
    '3002': 'JAX-RS',
    '3003': 'HttpServlet'
}

METRICS = {
    'iterations': 'Iterationen',
    'data_received': 'Datengröße (in kB)',
    'data_sent': 'Datengröße (in kB)',
    'vus': 'Anzahl',
    'http_reqs': 'Anzahl',
    'http_req_duration': 'Zeit (in ms)',
    'http_req_waiting': 'Zeit (in ms)',
    'http_req_blocked': 'Zeit (in ms)',
    'http_req_failed': 'Anzahl',
    'http_req_tls_handshaking': 'Zeit (in ms)',
    'http_req_receiving': 'Zeit (in ms)',
    'http_req_sending': 'Zeit (in ms)',
    'http_req_connecting': 'Zeit (in ms)',
    'checks': 'Anteil (in %)',
    'processing_time': 'Zeit (in ms)',
    'total_duration': 'Zeit (in ms)',
}

TITLES = {
    'iterations': 'Iterationen',
    'data_received': 'Erhaltene Daten',
    'data_sent': 'Gesendete Daten',
    'vus': 'Virtuell simulierte Nutzer',
    'http_reqs': 'HTTP-Anfragen',
    'http_req_duration': 'Durchschnittliche Dauer für HTTP-Anfragen',
    'http_req_waiting': 'Durchschnittliche Wartezeit für HTTP-Anfragen',
    'http_req_blocked': 'Durchschnittliche Blockierte Zeit für HTTP-Anfragen',
    'http_req_failed': 'Fehlgeschlagene HTTP-Anfragen',
    'http_req_tls_handshaking': 'Durchschnittliche TLS-Handshake-Dauer',
    'http_req_receiving': 'Durchschnittliche Empfangszeit für HTTP-Anfragen',
    'http_req_sending': 'Durchschnittliche Sendezeit für HTTP-Anfragen',
    'http_req_connecting': 'Durchschnittliche Verbindungszeit für HTTP-Anfragen',
    'checks': 'Checks',
    'processing_time': 'Durchschnittliche Verarbeitungszeit',
    'total_duration': 'Gesamtdauer des Tests',
    '01': '01 (single-threaded)',
    '01|multi': f'01 (multi-threaded{THREAD_MODE})',
    '02': '02 (single-threaded)',
    '02|multi': f'02 (multi-threaded{THREAD_MODE})',
    '03': '03 (single-threaded)',
    '03|multi': f'03 (multi-threaded{THREAD_MODE})',
    '04': '04 (single-threaded)',
    '04|multi': f'04 (multi-threaded{THREAD_MODE})',
    '05': '05 (single-threaded)',
    '05|multi': f'05 (multi-threaded{THREAD_MODE})',
    '06': '06 (single-threaded)',
    '06|multi': f'06 (multi-threaded{THREAD_MODE})',
    '07': '07 (single-threaded)',
    '07|multi': f'07 (multi-threaded{THREAD_MODE})',
    '08': '08 (single-threaded)',
    '08|multi': f'08 (multi-threaded{THREAD_MODE})',
    '09': '09 (single-threaded)',
    '09|multi': f'09 (multi-threaded{THREAD_MODE})',
    '10': '10 (single-threaded)',
    '10|multi': f'10 (multi-threaded{THREAD_MODE})',
    '11': '11 (single-threaded)',
    '11|multi': f'11 (multi-threaded{THREAD_MODE})',
    '12': '12 (single-threaded)',
    '12|multi': f'12 (multi-threaded{THREAD_MODE})',
    '13': '13 (single-threaded)',
    '13|multi': f'13 (multi-threaded{THREAD_MODE})',
    '14': '14 (single-threaded)',
    '14|multi': f'14 (multi-threaded{THREAD_MODE})',
}

def read_newest_json_file():
    files = [f for f in os.listdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), '../results'))]
    
    newest_file = None
    newest_time = None

    for file in files:
        try:
            timestamp_str = file.split('.')[0]
            file_time = datetime.strptime(timestamp_str, '%Y-%m-%dT%H-%M-%S')

            if newest_file is None or file_time > newest_time:
                newest_time = file_time
                newest_file = file
            
        except ValueError:
            print(f'{file} wird übersprungen...')

    return newest_file

def plot_performance_data():
    global JSON_FOLDER, JSON_FILE, FILTERS
    if not JSON_FILE:
        JSON_FILE = read_newest_json_file()
    
    print(JSON_FILE)

    output_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), f"../plots/{JSON_FILE.split('.')[0]}/")
    
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    with open(f'{JSON_FOLDER}{JSON_FILE}', 'r') as f:
        data = json.load(f)

    processed_data = {}
    for element in data['root_group']['groups']:
        _, app_name, benchmark_name = element['name'].replace('_multi', '|multi').split('_')
        if app_name not in processed_data:
            processed_data[app_name] = {}
        processed_data[app_name][benchmark_name] = element['metrics']
    
    all_benchmark_names = set()
    for app_data in processed_data.values():
        all_benchmark_names.update(app_data.keys())

    total_values = {}
    total_value_types = {}
    
    for benchmark_name in all_benchmark_names:
        is_multi = benchmark_name.endswith('|multi')

        benchmark_data = {}
        for app_name, app_data in processed_data.items():
            if benchmark_name in app_data:
                benchmark_data[app_name] = app_data[benchmark_name]
    
        all_stats = set()
        for app_name, app_benchmark_data in benchmark_data.items():
            all_stats.update(app_benchmark_data.keys())

        for stat_name in all_stats:
            if FILTERS and stat_name not in FILTERS:
                continue

            fig, ax = plt.subplots(figsize=(4, 2))
            # plt.title(f'{TITLES[stat_name]} für {TITLES[benchmark_name]}')
            plt.xlabel('Applikation')
            plt.ylabel(METRICS[stat_name])
            # plt.tight_layout()
            plt.grid(axis='y', linestyle='--', alpha=0.3, color='black')

            app_names = list(benchmark_data.keys())
            x_labels = []
            y_values = []
            colors = []

            total_key = f'V2_{stat_name}' if is_multi else f'V1_{stat_name}'

            if not total_key in total_values:
                total_values[total_key] = {}
            
            if not total_key in total_value_types:
                total_value_types[total_key] = ''

            for i, app_name in enumerate(app_names):
                if stat_name in benchmark_data[app_name]:
                    stat_data = benchmark_data[app_name][stat_name]
                    
                    if not app_name in total_values[total_key]:
                        total_values[total_key][app_name] = 0

                    match stat_data['type']:
                        case 'trend':
                            x_labels.append(APPLICATIONS[app_name])
                            y_values.append(stat_data['values']['avg'])
                            total_value_types[total_key] = stat_data['type']
                            total_values[total_key][app_name] += stat_data['values']['avg']
                            colors.append(COLORS[i % len(COLORS)])

                        case 'counter':
                            x_labels.append(APPLICATIONS[app_name])
                            y_values.append(stat_data['values']['count'])
                            total_value_types[total_key] = stat_data['type']
                            total_values[total_key][app_name] += stat_data['values']['count']
                            colors.append(COLORS[i % len(COLORS)])
                        
                        case 'rate':
                            x_labels.append(APPLICATIONS[app_name])
                            y_values.append((stat_data['values']['rate'] * 100))
                            total_value_types[total_key] = stat_data['type']
                            total_values[total_key][app_name] += stat_data['values']['rate'] * 100
                            colors.append(COLORS[i % len(COLORS)])
                        
                        case 'gauge':
                            x_labels.append(APPLICATIONS[app_name])
                            y_values.append(stat_data['values']['value'])
                            total_value_types[total_key] = stat_data['type']
                            total_values[total_key][app_name] += stat_data['values']['value']
                            colors.append(COLORS[i % len(COLORS)])

                        case _:
                            print(f"unbekannter statistik-typ gefunden: {stat_data['type']} für {stat_name} in {app_name}|{benchmark_name}")

                if not x_labels:
                    print(f'keine werte zum plotten von {stat_name} für {app_name}|{benchmark_name} gefunden')
                    plt.close()
                    continue

            plt.bar(x_labels, y_values, color=colors)

            filename = f'{benchmark_name}_{stat_name}.png'
            filename = filename.replace('/', '_').replace('|', '_').replace('{', '_').replace('}', '_').replace(':true', '')
            filepath = os.path.join(output_dir, filename)

            plt.savefig(filepath)
            plt.close()
            print(f'plot in {output_dir} gespeichert')

    for stat_name, stat_data in total_values.items():
        if (stat_name.startswith('V1_')):
            stat_key = stat_name.replace('V1_', '')
            is_multi = False

        elif (stat_name.startswith('V2_')):
            stat_key = stat_name.replace('V2_', '')
            is_multi = True

        else: 
            continue

        if FILTERS and stat_key not in FILTERS:
            continue

        fig, ax = plt.subplots(figsize=(4, 2))
        # plt.title(f'{TITLES[stat_name]}')
        plt.xlabel('Applikation')
        plt.ylabel(METRICS[stat_key])
        # plt.tight_layout()
        plt.grid(axis='y', linestyle='--', alpha=0.3, color='black')

        app_names = list(stat_data.keys())
        x_labels = []
        y_values = []
        colors = []

        for i, (app_name, app_stat) in enumerate(stat_data.items()):
            x_labels.append(APPLICATIONS[app_name])
            if total_value_types[stat_name] == 'counter':
                y_values.append(app_stat)
            else:    
                y_values.append(app_stat / len([key for key in total_values.keys() if key.startswith('V2_' if is_multi else 'V1_')]))
            colors.append(COLORS[i % len(COLORS)])

        if not x_labels:
                print(f'keine werte zum plotten von {stat_name} für {app_name}|{benchmark_name} gefunden')
                plt.close()
                continue
            
        plt.bar(x_labels, y_values, color=colors)

        filename = f'total_{stat_name}.png'
        filename = filename.replace('/', '_').replace('|', '_').replace('{', '_').replace('}', '_').replace(':true', '')
        filepath = os.path.join(output_dir, filename)

        plt.savefig(filepath)
        plt.close()
        print(f'plot in {output_dir} gespeichert')



plot_performance_data()