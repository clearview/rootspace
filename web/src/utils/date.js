function msToSecond(ms) {
    return Math.round(ms / 1000);
}
function msToMinute(ms) {
    return Math.round(ms / 1000 / 60);
}
function msToHour(ms) {
    return Math.round(ms / 1000 / 60 / 60);
}
function msToDay(ms) {
    return Math.round(ms / 1000 / 60 / 60 / 24);
}
function formatAmPm(hour, minute) {
    var ampm = hour >= 12 ? 'pm' : 'am';
    hour = hour % 12;
    hour = hour || 12;
    return "".concat(hour, ":").concat(minute < 10 ? '0' + minute : minute, " ").concat(ampm);
}
var dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var monthNamesShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export function formatDueDate(from, to) {
    var days = msToDay(to.getTime() - from.getTime());
    if (days === -1) {
        return 'Tomorrow';
    }
    if (days === 0) {
        return 'Today';
    }
    if (days === 1) {
        return 'Yesterday';
    }
    return "".concat(monthNames[from.getMonth()], " ").concat(from.getDate(), ", ").concat(from.getFullYear());
}
export function formatAsSimpleDate(date) {
    return "".concat(monthNames[date.getMonth()], " ").concat(date.getDate(), ", ").concat(date.getFullYear());
}
export function formatAsSimpleDateTime(date, abbreviateMonth) {
    if (abbreviateMonth === void 0) { abbreviateMonth = false; }
    return "".concat(abbreviateMonth ? monthNamesShort[date.getMonth()] : monthNames[date.getMonth()], " ").concat(date.getDate(), ", ").concat(formatAmPm(date.getHours(), date.getMinutes()));
}
export function formatRelativeTo(from, to) {
    var justNow = msToSecond(to.getTime() - from.getTime()) < 60;
    if (justNow) {
        return 'Just now';
    }
    var mins = msToMinute(to.getTime() - from.getTime());
    if (mins < 3) {
        return 'Few mins ago';
    }
    if (mins < 60) {
        return "".concat(mins, " mins ago");
    }
    var hours = msToHour(to.getTime() - from.getTime());
    if (hours < 2) {
        return 'an hour ago';
    }
    if (hours < 24) {
        return "".concat(hours, " hours ago");
    }
    var days = msToDay(to.getTime() - from.getTime());
    if (days < 2) {
        return 'Yesterday';
    }
    return "".concat(dayNames[from.getDay()], ", ").concat(monthNames[from.getMonth()], " ").concat(from.getDate(), " at ").concat(formatAmPm(from.getHours(), from.getMinutes()));
}
export function formatRelativeToLower(from, to) {
    var justNow = msToSecond(to.getTime() - from.getTime()) < 60;
    if (justNow) {
        return 'just now';
    }
    var mins = msToMinute(to.getTime() - from.getTime());
    if (mins < 3) {
        return 'few mins ago';
    }
    if (mins < 60) {
        return "".concat(mins, " mins ago");
    }
    var hours = msToHour(to.getTime() - from.getTime());
    if (hours < 2) {
        return 'an hour ago';
    }
    if (hours < 24) {
        return "".concat(hours, "h ago");
    }
    var days = msToDay(to.getTime() - from.getTime());
    if (days < 2) {
        return 'yesterday';
    }
    return "on ".concat(monthNames[from.getMonth()], " ").concat(from.getDate(), " at ").concat(formatAmPm(from.getHours(), from.getMinutes()));
}
//# sourceMappingURL=date.js.map