export default function secondsToTimeString(num) {
    num = Number(num);

    let hours = 0;
    let minutes = 0;
    let seconds = 0;

    while (num >= 60 * 60) {
        hours++;
        num -= 60 * 60;
    }

    while (num >= 60) {
        minutes++;
        num -= 60;
    }

    seconds = num;

    let result = '';
    
    result += hours > 0 ? `${hours}h` : '';
    result += minutes > 0 ? `${minutes}m` : '';
    result += seconds >= 0 ? `${seconds}s` : '';

    return String(result);
}