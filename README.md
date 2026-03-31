# Evaluierung einer Migration von Node.js zu Bun am Beispiel eines Full-Stack-JavaScript-Systems

Dieses Repository enthält alle Testskripte zur Messung der API- (1) bzw. UI-Performance (2).

Das Repository basiert auf dem Repository für API-Benchmarks [(Angermann, 2025a)](https://github.com/itsinfi/bt-tests#Angermann_2025a), das zu einer vorigen Hausarbeit erstellt wurde [(Angermann, 2025b)](https://github.com/itsinfi/bt-tests#Angermann_2025b).

## Skripte

-   src/fb1.api-test.ts: k6-Testskript für FB1
-   src/fb2.api-test.ts: k6-Testskript für FB2
-   src/convert_ids.ts: Vorbereitung für FB2 zum Konvertieren der Bestellungs-IDs zu einem JavaScript-Format
-   src/generate-stripe-date.ts: Generieren der Stripe-Header und des -Payloads
-   src/lighthouse.ts: Durchführen des Google Lighthouse Tests
-   src/monitor-docker-ram.ts: Monitoring des RAM-Verbrauchs eines Containers während der Tests

## Quellen

<p id="Angermann_2025a" style="text-indent: -2em; margin-left: 2em;">
Angermann, S. (2025a). <i>hausarbeit-web-dev-tests</i> [GitHub-Repository]. GitHub. <a href="https://github.com/itsinfi/hausarbeit-web-dev-tests">https://github.com/itsinfi/hausarbeit-web-dev-tests</a>
</p>
<p id="Angermann_2025b" style="text-indent: -2em; margin-left: 2em;">
Angermann, S. (2025b). <i>Benchmarking von Jakarta EE und Node.js: Performance aktueller Backend-Technologien
im Vergleich </i>  [unveröffentlichte Hausarbeit]. IU Internationale Hochschule.
</p>