const express = require("express");
const mysql = require("mysql");

const app = express();

app.listen("3000",() => {
    console.log("Server started on port 3000")
})

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456",
    database: "covid",
});

app.get('/covid/:country/:period', (req,res) => {

    // Extracting the Country and Period from the URL
    let { country, period } = req.params;
    let records = [];

    // Extracting the Month and Year from the Period
    let month = period.slice(0,2);
    let year = period.slice(2);

    // Setting the end date for the requested Month
    let endDate = (month) => {
        if (month == "02")
            return "28";
        else if (month == "01" || month == "03" || month == "05" || month =="07" || month == "08" || month == "10" || month == "12")
            return "31";
        else 
            return "30";
    };

    // SQL query which negates the case sensitivity and fetches the records pertaining to the specified Country for a particular Period
    let sql = `SELECT * FROM coviddata WHERE LOWER(Country) = '${country.toLowerCase()}' and ObsDate between '${year}/${month}/01' and '${year}/${month}/${endDate(month)}'`;
    
    // Running the query to fetch the records from my local MySQL Database
    let query = con.query(sql, (err,result) => {

        // Throws error if there is an error in connecting to the database
        if (err) {
            throw err;
        }

        // Sends a message if there is no records for a Country in the specified Period
        if (result.length == 0) {
            res.write(`<h1>No records for that period</h1>`);
            return;
        }

        // Create a list of objects. Objects are records/rows fetched from the database
        for (let index = 0; index < result.length; index++) {
            let obj = {
                ObservationDate: result[index].ObsDate,
                State: result[index].State,
                Confirmed: result[index].Confirmed,
                Deaths: result[index].Deaths,
                Recovered: result[index].Recovered
            }
            records.push(obj);
        }

        // Columns to be displayed
        let fields = ['Observation Date','State','Confirmed','Deaths','Recovered'];

        res.write(`<h1 style="text-align: center">COVID Stats - ${country.toUpperCase()}</h1>`);

        // Table to display the records
        res.write('<table><tr>');
        for (let index = 0; index < fields.length; index++) {
            res.write(`<th  style="border: 1px solid black">${fields[index]}</th>`);
        }
        res.write('</tr>');

        for (let index = 0; index < records.length; index++) {
            // Converting the date to a readable format
            let odate = new Date(records[index].ObservationDate);
            res.write('<tr>');
            res.write(`<td style="border: 1px solid black">${odate.toDateString()}</td>`)
            res.write(`<td  style="border: 1px solid black">${records[index].State}</td>`)
            res.write(`<td  style="border: 1px solid black">${records[index].Confirmed}</td>`)
            res.write(`<td  style="border: 1px solid black">${records[index].Deaths}</td>`)
            res.write(`<td  style="border: 1px solid black">${records[index].Recovered}</td>`)
            res.write('</tr>');
        }

        res.write('</table>');

        res.end();
        
        console.log(records);
        // console.log(JSON.stringify(obj));
    })
})

