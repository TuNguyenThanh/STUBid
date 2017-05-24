exports.timeLeftFormat = (duration) => {
    var hours = String(parseInt(duration / 3600, 10)); duration -= 3600 * hours;
    var minutes = String(parseInt(duration / 60, 10));
    var seconds = duration - 60 * minutes;

    var output = [hours, minutes, seconds].map(number => number<10?`0${number}`:number).join(":");
    return output;
}