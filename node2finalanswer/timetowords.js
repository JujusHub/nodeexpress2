function timeToWords(timeStr) {
    const [hour, minute] = timeStr.split(':').map(Number);
    
    const numToWords = {
        0: "twelve", 1: "one", 2: "two", 3: "three", 4: "four",
        5: "five", 6: "six", 7: "seven", 8: "eight", 9: "nine",
        10: "ten", 11: "eleven", 12: "twelve", 13: "one",
        14: "two", 15: "three", 16: "four", 17: "five",
        18: "six", 19: "seven", 20: "eight", 21: "nine",
        22: "ten", 23: "eleven"
    };

    if (timeStr === "00:00") {
        return "midnight";
    } else if (timeStr === "12:00") {
        return "noon";
    }

    const period = hour < 12 ? "am" : "pm";
    const hourWord = numToWords[hour % 24];

    if (minute === 0) {
        return `${hourWord} o’clock ${period}`;
    } 
    
    let minuteWord;
    if (minute < 10) {
        minuteWord = `oh ${numToWords[minute]}`;
    } else if (minute % 10 === 0) {
        minuteWord = numToWords[minute];
    } else {
        minuteWord = `${numToWords[Math.floor(minute / 10) * 10]} ${numToWords[minute % 10]}`;
    }

    return `${hourWord} ${minuteWord} ${period}`;
}
module.exports = timeToWords;
