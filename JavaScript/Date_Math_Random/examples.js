"use strict" // WHOLE-SCRIPT STRICT MODE SYNTAX.





function date_printer(language, options_obj = null){
    if(options_obj === null){
        options_obj = {
            hour12: false, // true.
            year: "2-digit", // "numeric".
            month: "2-digit", // "numeric", "long", "short", "narrow".
            day: "2-digit", // "numeric".
            hour: "2-digit", // "numeric".
            minute: "2-digit", // "numeric".
            second: "2-digit", // "numeric".
            timeZone: "Etc/GMT0", // https://en.wikipedia.org/wiki/List_of_tz_database_time_zones.
            timeZoneName: "short" // "long".
        };
    }
    let the_formatter = new Intl.DateTimeFormat(language, options_obj);

    return {
        print: function(d){
            return the_formatter.format(d);
        },
        print_date_in_another_timezone: function(d, tz_str){
            const old_tz_str = options_obj.timeZone;
            options_obj.timeZone = tz_str;
            const formatter = new Intl.DateTimeFormat(language, options_obj);
            options_obj.timeZone = old_tz_str;
            return formatter.format(d);
        }
    }
}



const my_printer = date_printer("en-GB");
console.log("my printer: ", my_printer.print(new Date()));
// https://en.wikipedia.org/wiki/List_of_tz_database_time_zones.
/*
console.log("my printer: timezone: Etc/GMT+4: ", my_printer.print_date_in_another_timezone(new Date(), "Etc/GMT+4"));
console.log("my printer: timezone: Asia/Jakarta: ", my_printer.print_date_in_another_timezone(new Date(), "Asia/Jakarta"));
console.log("my printer: timezone: Europe/London: ", my_printer.print_date_in_another_timezone(new Date(), "Europe/London"));
*/




function duration_between_two_dates(d1, d2, rounding_function){
    const duration_msec = Math.abs(d2 - d1);
    let obj = {
        duration_in_years: rounding_function(duration_msec / (1000 * 60 * 60 * 24 * 365)),
        duration_in_days: rounding_function(duration_msec / (1000 * 60 * 60 * 24)),
        duration_in_hours: rounding_function(duration_msec / (1000 * 60 * 60)),
        duration_in_minutes: rounding_function(duration_msec / (1000 * 60)),
        duration_in_seconds: rounding_function(duration_msec / 1000),
        duration_in_milliseconds: duration_msec
    };
    // years:
    obj.years = Math.floor(duration_msec / (1000 * 60 * 60 * 24 * 365));
    let left = duration_msec - (obj.years * (1000 * 60 * 60 * 24 * 365));
    // days:
    obj.days = Math.floor(left / (1000 * 60 * 60 * 24));
    left -= obj.days * (1000 * 60 * 60 * 24);
    // hours:
    obj.hours = Math.floor(left / (1000 * 60 * 60));
    left -= obj.hours * (1000 * 60 * 60);
    // minutes:
    obj.minutes = Math.floor(left / (1000 * 60));
    left -= obj.minutes * (1000 * 60);
    // seconds:
    obj.seconds = Math.floor(left / 1000);
    left -= obj.seconds * 1000;
    // milliseconds:
    obj.milliseconds = Math.floor(left);
    return obj;
}



// Z == UTC (Universal Time Coordinated) == GMT (Greenwich Mean Time).
const date1 = new Date("2025-04-15T06:30:30Z");
const date2 = new Date("2020-05-20T18:45:45Z");

// arguments: year, month{0-11}, day, hours, minutes, seconds, milliseconds
const date11 = new Date(Date.UTC(2025, 4-1, 15, 6, 30, 30, 750));
const date22 = new Date(Date.UTC(2020, 5-1, 20, 18, 45, 45, 500));

const date111 = new Date(Date.UTC(2020, 4-1, 20, 18, 30, 45, 750));
const date222 = new Date(Date.UTC(2020, 4-1, 20, 18, 30, 30, 500));

/*
console.log("Duration obj: ceil:", duration_between_two_dates(date1, date2, Math.ceil));
console.log("Duration obj: ceil:", duration_between_two_dates(date11, date22, Math.ceil));
console.log("Duration obj: ceil:", duration_between_two_dates(date111, date222, Math.ceil));
console.log("Duration obj: floor:", duration_between_two_dates(date1, date2, Math.floor));
console.log("Duration obj: floor:", duration_between_two_dates(date11, date22, Math.floor));
console.log("Duration obj: floor:", duration_between_two_dates(date111, date222, Math.floor));
*/


// my_data = new Date(); creates a new 'date' object with the current date and time from the user's browser
// let msec = Date.parse('2018-01-01'); will convert this date to milliseconds.
// let now_data = new Date(msec); will use the milliseconds and convert it to 'date' object.

// .now(); Returns the number of milliseconds since midnight Jan 1, 1970.
// .setTime(); Sets a date to a specified number of milliseconds after/before January 1, 1970.







function calculate_working_hours_between_dates(start, end, schedule){

    // the schedule from the JSON file contains the hours as strings, here we convert it to date-objects:
    function f_parse_str_hours_into_date_objs(arr, curr_date, text = null){
        text = text ? ` '${text}' ` : " ";
        // new array for containing date objects instead of the strings:
        const dates = new Array();
        // the array has to contain a set of time points, stars and stops:
        if(arr.length % 2 === 1){
            throw new Error(`The${text}hours arrays has to contain sets of two times, start and stop time!`);
        }
        let previous = {date: null, str: ""};
        arr.forEach(function(date_str){
            // check #1 if the string representing the time point is valid:
            if(date_str.length !== 5 || date_str[2] !== ":"){
                throw new Error(`The hours in the${text}arrays has to be in this format: '01:45'!. '${date_str}' is not valid!`);
            }
            // creating date object from the string:
            const hours_and_minutes = date_str.split(":");
            const hours_int = parseInt(hours_and_minutes[0]);
            const minutes_int = parseInt(hours_and_minutes[1])
            // check #2 if the string representing the time point is valid:
            if(hours_int < 0 || hours_int > 24 
                || minutes_int < 0 || minutes_int > 59 
                || hours_int + (minutes_int * 0.01) > 24 
                || isNaN(hours_int) || isNaN(minutes_int)){
                throw new Error(`In the${text}arrays, this: '${date_str}' is not valit time! (hours: '00'-'24' and minutes: '00'-'59')`);
            }
            dates.push(new Date(curr_date.getUTCFullYear(), curr_date.getUTCMonth(), curr_date.getUTCDate(), hours_int, minutes_int, 0, 0));
            // check #3 the hours need to be in ascending chronological order:
            if(previous.date && previous.date >= dates[dates.length-1]){
                throw new Error(`The hours in the${text}arrays need to be in an ascending order, from first to last!. '${previous.str}' before '${date_str}' is not valid!`);
            }
            previous.date = dates[dates.length-1];
            previous.str = date_str;
        });
        return dates;
    }

    // the function treat the date-elements in pairs of two, the first element as a start of a 
    // duration and the second as the end, this is repeated for all the elements in the arrays, 
    // therefore there will alway be an even-number of elements in the array.
    // where the durations overlap each other, arrB is subtracted from arrA:
    function f_subtract_date_arrB_from_date_arrA(arrA, arrB){
        // there are 6 ways the durations can overlap:
        //  Bs Be As Ae    Bs As Be Ae    Bs As Ae Be   (Bs = arrB duration start, Be = arrB duration end).
        //  As Ae Bs Be    As Bs Ae Be    As Bs Be Ae   (As = arrA duration start, Ae = arrA duration end).
        //  >>time>>>    >>time>>>    >>time>>>
        const result_arr = new Array();
        const merge_arr = new Array();
        // merge 'arrA' and 'arrB' to one array:
        arrA.forEach(function(date){ merge_arr.push({name: "A", date: date}); });
        arrB.forEach(function(date){ merge_arr.push({name: "B", date: date}); });
        // sorting the two combine arrrays in ascending chronological order:
        merge_arr.sort(function(d1, d2){
            const diff = d1.date - d2.date;
            if(diff === 0){
                d1.name = d2.name = "AB";
            }
            return diff; 
        });
        let A_active = false, B_active = false, AB_active = false;
        merge_arr.forEach(function(obj){
            if(obj.name === "A"){
                A_active = !A_active;
                if( ! B_active){
                    result_arr.push(obj.date);
                }
            }
            else if(obj.name === "B"){
                B_active = !B_active;
                if(A_active){
                    result_arr.push(obj.date);
                }
            }
            else if(obj.name === "AB"){
                if(AB_active){
                    A_active = !A_active;
                    B_active = !B_active;
                    if(A_active !== B_active){
                        result_arr.push(obj.date);
                    }
                }
                AB_active = !AB_active;
            }
        });
        return result_arr;
    }

    function f_add_date_arrB_to_date_arrA(arrA, arrB){
        const result_arr = new Array();
        const merge_arr = new Array();
        let act = true;
        // merge 'arrA' and 'arrB' to one array:
        arrA.forEach(function(date){ merge_arr.push({date: date, active: act}); act = !act; });
        arrB.forEach(function(date){ merge_arr.push({date: date, active: act}); act = !act; });
        // sorting the two combine arrrays in ascending chronological order:
        merge_arr.sort(function(d1, d2){ return d1.date - d2.date; });
        // remove when durations overlap:
        act = 0;
        merge_arr.forEach(function(obj){
            if(act === 0){
                result_arr.push(obj.date);
            }
            obj.active ? act++ : act--;
            if(act === 0){
                result_arr.push(obj.date);
            }
        });
        // remove duplicates from the array:
        for(let i = result_arr.length - 2; i >= 0; i--){
            if(result_arr[i].getTime() === result_arr[i+1].getTime()){
                result_arr.splice(i, 2);
            }
        }
        return result_arr;
    }

    // skipping all the holidays and workdays that are not between 'start_date' and 'end_date':
    function Date_finder(arr, text = "date"){
        // ---CONSTRUCTOR---
        // sorting the arrays based on the dates:
        arr.sort(function(d1, d2){ return d1.date - d2.date; });
        // ---PRIVATE---
        let curr_at = 0;
        // ---PUBLIC---
        this.get_index = function(){ return curr_at; }
        this.find_next_date = function(date){
            while((curr_at < arr.length) && (arr[curr_at].date < date)){
                //console.log(` --- Skipp ${text}:`, arr[curr_at].date.toDateString());
                curr_at++;
            }
            console.log(`Next ${text} at:`, (curr_at < arr.length) ? arr[curr_at].date.toDateString() : "Never");
            return (curr_at < arr.length) ? arr[curr_at] : null;
        }
        this.is_next = function(date){
            if(curr_at < arr.length && arr[curr_at].date.getTime() === date.getTime()){
                // move on to the next date:
                curr_at++;
                return arr[curr_at-1];
            }
            return (curr_at < arr.length) ? false : null;
        }
    }

    // get the current weekdays based on the timeline:
    function Timeline(schedule){
        // ---CONSTRUCTOR---
        // the timeline always need at least three things, and it's length is always an odd number:
        if(schedule.timeline.length < 3 || (schedule.timeline.length % 2 === 0)){
            throw new Error("In the 'timeline' we need at least three things, starting date, the name of the weekdays and an ending date. (in this order)");
        }
        // converting the date strings into date objects checking and the date is valid:
        for(let i = 0, last = null; i < schedule.timeline.length; i++){
            if(i % 2 === 0){
                // check if the string representing the date is valid:
                let date = new Date(schedule.timeline[i]);
                if(isNaN(date.getTime())){
                    throw new Error(`In the 'timeline', this: '${schedule.timeline[i]}' is not a valid date!`);
                }
                // the timeline need to be in an ascending order, from first to last:
                if(last && last >= date){
                    throw new Error(`The 'timeline', need to be in an ascending order, from first to last! '${last.toDateString()}' can not be before '${date.toDateString()}' in the timeline!`);
                }
                last = date;
                // converting the string to date-object:
                schedule.timeline[i] = date;
            }
            else{
                // check if the string representing the weekdays is valid:
                const name_str = schedule.timeline[i];
                if( ! Array.isArray(schedule[name_str])){
                    throw new Error(`In the 'timeline', there are no weekdays with this name: '${schedule.timeline[i]}'!`);
                }
            }
        }
        // ---PRIVATE---
        let curr_at = 0;
        // ---PUBLIC---
        this.check_range = function(start_date, end_date){
            // the requested range for calculate the work hours needs to be within the timeline:
            if(start_date < schedule.timeline[0] || schedule.timeline[schedule.timeline.length-1] < end_date){
                throw new Error(`The 'timeline' starts at '${schedule.timeline[0].toDateString()} 00:00' and ends at '${schedule.timeline[schedule.timeline.length-1].toDateString()} 00:00', the requested range from '${start_date}' to '${end_date}' is not within this timeline!`);
            }
        }
        this.get_current_weekdays = function(date){
            // finding and returning the name of the current weekdays in the timeine:
            while((curr_at + 2 < schedule.timeline.length )&& schedule.timeline[curr_at] <= date){
                curr_at += 2;
            }
            return schedule.timeline[curr_at-1]
        }
    }

    // ---START---
    if(end <= start){
        throw new Error("The start-date must be before the end-date!");
    }
    let total_working_time = 0;
    // getting 'start' and 'end' dates without hours, minutes, seconds and milliseconds:
    let start_date = new Date(start.getUTCFullYear(), start.getMonth(), start.getUTCDate());
    let end_date = new Date(end.getUTCFullYear(), end.getMonth(), end.getUTCDate());
    let curr_date = new Date(start_date.getTime());
    // move over all holidays and workdays that have already passed the starting-date:
    const workday_finder = new Date_finder(schedule.workdays, "workday");
    workday_finder.find_next_date(curr_date);
    const holiday_finder = new Date_finder(schedule.holidays, "holiday");
    holiday_finder.find_next_date(curr_date);
    // find the right spot in the timeline:
    const timeline = new Timeline(schedule.weekdays);
    timeline.check_range(start, end);

    // loop over each day and calculate work hours:
    for(let day_number = 1; curr_date <= end_date; day_number++, curr_date.setDate(curr_date.getDate() + 1)){
        // get the current weekdays from the 'timeline':
        const weekdays_name_str = timeline.get_current_weekdays(curr_date);
        const weekdays = schedule.weekdays[weekdays_name_str];
        // get the current-date's weekday-hours:
        let weekday_hours = weekdays[curr_date.getDay()].working_hours;
        // convert the current-date weekday-hours from string to date obj:
        weekday_hours = f_parse_str_hours_into_date_objs(weekday_hours, curr_date, "weekdays");

        console.log("\nDay number:", day_number, "| Date is:", curr_date.toDateString(), "| Timeline:", weekdays_name_str);

        // is holiday:
        let holiday = holiday_finder.is_next(curr_date);
        while(Boolean(holiday)){
            // get 'holiday_hours' as array of date objects, instead of array of strings:
            const holiday_hours = f_parse_str_hours_into_date_objs(holiday.freetime_hours, curr_date, "holidays");
            console.log("  Holiday hours:", holiday_hours);
            // remove weekday-work-hours if they are on holiyday-time:
            weekday_hours = f_subtract_date_arrB_from_date_arrA(weekday_hours, holiday_hours);
            // move on to the next holiday:
            holiday = holiday_finder.is_next(curr_date);
        }

        // is workday:
        let workday = workday_finder.is_next(curr_date);
        while(Boolean(workday)){
            // get 'workday_hours' as array of date objects, instead of array of strings:
            const workday_hours = f_parse_str_hours_into_date_objs(workday.working_hours, curr_date, "workdays");
            console.log("  Workday hours:", workday_hours);
            // add the workday-hours to the weekday-work-hours:
            weekday_hours = f_add_date_arrB_to_date_arrA(weekday_hours, workday_hours);
            // move on to the next workday:
            workday = workday_finder.is_next(curr_date);
        }

        // is first day:
        // if current-date is the starting-date, we need to remove all work-hours the are before the start-time:
        if(curr_date.getTime() === start_date.getTime()){
            console.log(`  First day! Starting at: [${start.getUTCHours()}:${start.getUTCMinutes()}]`);
            let i = 0;
            while(i < weekday_hours.length){
                // (W = weekday-work-hours start, W1 = weekday-work-hours end, C = 'curr_date' timepoint)
                if(weekday_hours[i] < start && weekday_hours[i+1] <= start){
                    // the 'start' timepoint is after the end of these weekday-work-hours.
                    //  W W1 C
                    i += 2;
                    continue;
                }
                else if(weekday_hours[i] < start){
                    // the 'start' timepoint is in-the-middle-of these weekday-work-hours.
                    //  W C W1
                    weekday_hours[i] = new Date(start.getTime());
                }
                // the 'start' timepoint is before the start of these weekday-work-hours.
                //  C W W1
                break;
            }
            // removing all the weekday-work-hours that are before the 'start' timepoint:
            weekday_hours.splice(0, i);
        }
        
        // is last day:
        // if current-date is the ending-date, we need to remove all work-hours that are after the end-time:
        if(curr_date.getTime() === end_date.getTime()){
            console.log(`  Last day! End at: [${end.getUTCHours()}:${end.getUTCMinutes()}]`);
            let i = 0;
            while(i < weekday_hours.length){
                if(weekday_hours[i] < end && weekday_hours[i+1] <= end){
                    //  W W1 E
                    i += 2;
                }
                else if(weekday_hours[i] < end){
                    //  W E W1
                    weekday_hours[i+1] = new Date(end.getTime());
                    //  W W1=E
                }
                else{
                    // E W W1
                    break;
                }
            }
            weekday_hours.splice(i, weekday_hours.length);
        }

        // calculating the total hours for the current date:
        let curr_date_msec = 0;
        for(let i = 0; i < weekday_hours.length; i += 2){
            curr_date_msec += weekday_hours[i+1].getTime() - weekday_hours[i].getTime();
        }
        const curr_date_hours = Math.floor(curr_date_msec * 0.001 * (1/60) * (1/60));
        const curr_date_minutes = Math.floor((curr_date_msec * 0.001 * (1/60)) % 60);
        console.log("  Weekday hours:", weekday_hours, "\n");
        console.log("  Total weekday time is", curr_date_hours, "hours and", curr_date_minutes, "minutes.\n");
        total_working_time += curr_date_msec;
    }
    const total_hours = Math.floor(total_working_time * 0.001 * (1/60) * (1/60));
    const total_minutes = Math.floor((total_working_time * 0.001 * (1/60)) % 60);
    return { "hours": total_hours, "minutes": total_minutes, "msec": total_working_time };
}




// '"timeline":["2021-1-1", "WINTER", "2021-4-22", "SUMMER", "2021-7-4", "CLOSED", "2021-7-18" "SUMMER" , "2021-10-23", "WINTER", "2022-4-21"],'+
const work_schedule_JSON =  '{"weekdays":{'+
                              '"timeline":["2021-3-1", "WINTER", "2021-3-16", "SUMMER", "2021-3-18", "CLOSED", "2021-3-22", "SUMMER", "2021-4-1"],'+
                              '"WINTER": ['+
                                '{"day":"Sunday",    "working_hours":[]},'+
                                '{"day":"Monday",    "working_hours":["08:15", "12:00", "13:00", "17:00"]},'+
                                '{"day":"Tuesday",   "working_hours":["08:00", "12:00", "13:00", "17:00"]},'+
                                '{"day":"Wednesday", "working_hours":["08:00", "12:00", "13:00", "17:00"]},'+
                                '{"day":"Thursday",  "working_hours":["08:00", "12:00", "13:00", "17:00"]},'+
                                '{"day":"Friday",    "working_hours":["08:00", "12:00", "12:30", "15:00"]},'+
                                '{"day":"Saturday",  "working_hours":["11:00", "14:00"]}'+
                              '], "SUMMER": ['+
                                '{"day":"Sunday",    "working_hours":[]},'+
                                '{"day":"Monday",    "working_hours":["10:15", "12:00", "13:00", "16:00"]},'+
                                '{"day":"Tuesday",   "working_hours":["10:00", "12:00", "13:00", "16:00"]},'+
                                '{"day":"Wednesday", "working_hours":["12:00", "14:00"]},'+
                                '{"day":"Thursday",  "working_hours":["10:00", "12:00", "13:00", "16:00"]},'+
                                '{"day":"Friday",    "working_hours":["10:00", "12:00", "12:30", "14:00"]},'+
                                '{"day":"Saturday",  "working_hours":[]}'+
                              '], "CLOSED": ['+
                                '{"day":"Sunday",    "working_hours":[]},'+
                                '{"day":"Monday",    "working_hours":[]},'+
                                '{"day":"Tuesday",   "working_hours":[]},'+
                                '{"day":"Wednesday", "working_hours":[]},'+
                                '{"day":"Thursday",  "working_hours":[]},'+
                                '{"day":"Friday",    "working_hours":[]},'+
                                '{"day":"Saturday",  "working_hours":[]}'+
                              ']'+
                            '}, "holidays": ['+
                              '{"date":"2021-3-04", "details":"", "freetime_hours":["06:00", "18:00"]},'+
                              '{"date":"2021-2-02", "details":"", "freetime_hours":["06:00", "18:00"]},'+
                              '{"date":"2021-2-10", "details":"", "freetime_hours":["06:00", "18:00"]},'+
                              '{"date":"2021-2-02", "details":"", "freetime_hours":["06:00", "18:00"]},'+
                              '{"date":"2021-3-04", "details":"For", "freetime_hours":["16:00", "18:00"]},'+

                              '{"date":"2021-3-09", "details":"Sex", "freetime_hours":["10:00", "10:33"]},'+
                              '{"date":"2021-3-10", "details":"For", "freetime_hours":["08:00", "10:10"]},'+
                              '{"date":"2021-3-12", "details":"Sex", "freetime_hours":["12:30", "15:55"]},'+

                              '{"date":"2021-4-08", "details":"", "freetime_hours":["09:10", "11:33"]},'+
                              '{"date":"2021-4-10", "details":"", "freetime_hours":["08:30", "09:30", "11:00", "11:30", "15:00", "16:00"]},'+
                              '{"date":"2021-4-12", "details":"", "freetime_hours":["08:00", "08:30", "11:30", "12:00", "12:30", "13:00", "14:30", "15:00"]},'+

                              '{"date":"2021-11-01", "details":"", "freetime_hours":["00:00", "24:00"]},'+
                              '{"date":"2021-11-08", "details":"", "freetime_hours":["00:00", "24:00"]},'+
                              '{"date":"2021-11-03", "details":"", "freetime_hours":["00:00", "24:00"]},'+
                              '{"date":"2021-12-13", "details":"", "freetime_hours":["09:00", "15:00"]},'+
                              '{"date":"2021-12-09", "details":"", "freetime_hours":["00:00", "24:00"]},'+
                              '{"date":"2021-12-24", "details":"Jól", "freetime_hours":["11:00", "24:00"]}'+

                            '], "workdays": ['+
                              '{"date":"2021-11-27", "details":"Black Friday #2", "working_hours":["00:00", "02:00"]},'+
                              '{"date":"2021-11-26", "details":"Black Friday #1", "working_hours":["06:00", "24:00"]},'+
                              '{"date":"2021-04-08", "details":"", "working_hours":["07:00", "23:59"]},'+
                              '{"date":"2021-04-10", "details":"", "working_hours":["12:30", "23:09"]},'+
                              '{"date":"2021-04-12", "details":"", "working_hours":["12:55", "24:00"]}'+
                            ']}';







let work_schedule_obj = null;
try {
    work_schedule_obj = JSON.parse(work_schedule_JSON, function(key, value){
        // converting the date strings into date objects:
        return (key === "date") ? new Date(value) : value;
    });
}
catch(error){
    console.warn("Error Parsing JSON! ", error);
}

// arguments: year, month{0-11}, day, hours, minutes, seconds, milliseconds
const start_work = new Date(Date.UTC(2021, 3-1, 6, 8, 55, 0, 0));
const end_work = new Date(Date.UTC(2021, 3-1, 13, 16, 45, 0, 0));
let total_time = null;
try {
    total_time = calculate_working_hours_between_dates(start_work, end_work, work_schedule_obj);
}
catch(error){
    console.warn("Error calculate working hours! ", error);
}
console.log("Total working time from", start_work, "to", end_work, "is\n", total_time.hours, "hours and", total_time.minutes, "minutes.");

// https://riptutorial.com/javascript/topic/265/date
// https://riptutorial.com/javascript/example/1476/create-a-new-date-object
