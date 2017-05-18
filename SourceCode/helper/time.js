exports.timeLeftFormat = (duration) => {
    var hours = String(parseInt(duration / 3600, 10)); duration -= 3600 * hours;
    var minutes = String(parseInt(duration / 60, 10));
    var seconds = duration - 60 * minutes;

    var output = [hours, minutes, seconds].map(str => str.length==1?`0${str}`:str).join(":");
    return output;
}