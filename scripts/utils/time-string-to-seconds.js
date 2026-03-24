export default function timeStringToSeconds(str) {
    str = String(str).trim();
    
    if (str.endsWith('s')) {
        return Number(str.replace('s', ''));
    } else if (str.endsWith('m')) {
        return Number(str.replace('m', '')) * 60;
    } else if (str.endsWith('h')) {
        return Number(str.replace('h', '')) * 60 * 60;
    }
}