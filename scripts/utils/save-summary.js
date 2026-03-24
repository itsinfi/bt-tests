const space = 2;
const replacer = null;

export function saveSummary(data, groupMetrics) {
    data.root_group.groups.forEach(group => {
        const metrics = {};

        Object.keys(groupMetrics[group.name]).forEach(metricKey => {
            const groupSpecificMetricKey = `${metricKey}_${group.name}`;

            if (data.metrics[groupSpecificMetricKey]) {
                metrics[metricKey] = data.metrics[groupSpecificMetricKey];
            }

            group.metrics = metrics;
        });
    });

    let result = {};
    const filename = `/results/${new Date().toISOString().split('.')[0].replace(':', '-').replace(':', '-')}.json`;
    result[filename] = JSON.stringify(data, replacer, space);
    return result;
}