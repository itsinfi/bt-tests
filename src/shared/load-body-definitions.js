export default function () {
    const bodyDefinitions = open('./data/body-definitions.json', 'r');
    return JSON.parse(bodyDefinitions);
}