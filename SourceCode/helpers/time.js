exports.timeLeftFormat = (duration) => {
    var hours = Math.floor(duration / 3600);
    var minutes = Math.floor((duration % 3600) / 60);
    var seconds = duration % 60;

    var output = [hours, minutes, seconds].map(number => number < 10 ? `0${number}` : number).join(":");
    return output;
}