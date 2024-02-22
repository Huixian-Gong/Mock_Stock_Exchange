document.addEventListener("DOMContentLoaded",  function() {
    document.getElementById("stockSearchForm").onsubmit = (function(e) {
        e.preventDefault();
        const ticker = document.getElementById("ticker").value.toUpperCase();
        fetch(`/lookup?symbol=${ticker}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById("results").innerHTML = "";
            if (Object.keys(data).length === 0) {
                document.getElementById("results").innerHTML = "<p class=\"empty_result\"> <span>Error: No record has been found, please enter a valid symbol</span></p>";
            } else {
                showtabs();
                tabs_company(data);
                stock_summary(ticker);
                charts(ticker);
                latest_news(ticker);
            }
        })
        .catch(error => console.error('Error:', error));
    }
    )
});

// The opentab() is adapted from https://www.w3schools.com/howto/howto_js_tabs.asp
function opentab(evt, tab) {
    var tabcontent = document.getElementsByClassName("tabcontent");
    for (var i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    var tablinks = document.getElementsByClassName("one_tab");
    for (var i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tab).style.display = "block";
    evt.currentTarget.className += " active";
}
 
// The showtabs() function is adapted from https://www.w3schools.com/howto/howto_js_tabs.asp
function showtabs() {
    document.getElementById("results").innerHTML =
                    "<div class=\"tabs\">"+
                    "<button id=\"open\" class=\"one_tab\" onclick=\"opentab(event, 'com')\">Company</button>"+
                    "<button class=\"one_tab\" onclick=\"opentab(event, 'sto')\">Stock Summary</button>"+
                    "<button class=\"one_tab\" onclick=\"opentab(event, 'cha')\">Charts</button>"+
                    "<button class=\"one_tab\" onclick=\"opentab(event, 'lat')\">Latest News</button></div>"+
                    "</div>" + 
                    "<div id=\"com\" class=\"tabcontent\"></div>"+
                    "<div id=\"sto\" class=\"tabcontent\"></div>"+
                    "<div id=\"cha\" class=\"tabcontent\"></div>"+
                    "<div id=\"lat\" class=\"tabcontent\"></div>";
    document.getElementById("open").click();
}

function tabs_company(data) {
    document.getElementById("com").innerHTML= "<img class=\"logos\" src='" + data.logo +" '>"+
    "<table class=\"company\">"+
    "<tr><td class=\"company_left\">Company Name</td><td class=\"company_right\">"+data.name+ "</td>"+
    "<tr><td class=\"company_left\">Stock Ticker Symbol</td><td class=\"company_right\">"+data.ticker+ "</td>"+
    "<tr><td class=\"company_left\">Stock Exchange Code</td><td class=\"company_right\">"+data.exchange+ "</td>"+
    "<tr><td class=\"company_left\">Company Start Date</td><td class=\"company_right\">"+data.ipo+ "</td>"+
    "<tr><td class=\"company_left\">Category</td><td class=\"company_right\">"+data.finnhubIndustry+ "</td>"+"</table>";
}

function stock_summary(ticker) {
    fetch(`/stock?symbol=${ticker}`)
    .then(response => response.json())
    .then(data => {
        document.getElementById("sto").innerHTML="<table class=\"stock\">"+
    "<tr><td class=\"company_left\">Stock Ticker Symbol</td><td class=\"company_right\">"+data.symbol+"</td>"+
    "<tr><td class=\"company_left\">Trading Day</td><td class=\"company_right\">"+ trading_day(data.t)+"</td>"+ 
    "<tr><td class=\"company_left\">Previous Closing Price</td><td class=\"company_right\">"+data.pc+"</td>"+
    "<tr><td class=\"company_left\">Opening Price</td><td class=\"company_right\">"+data.o+"</td>"+
    "<tr><td class=\"company_left\">High Price</td><td class=\"company_right\">"+data.h+"</td>"+
    "<tr><td class=\"company_left\">Low Price</td><td class=\"company_right\">"+data.l+"</td>"+
    "<tr><td class=\"company_left\">Change</td><td class=\"company_right\">"+trading_change(data.d)+"</td>"+
    "<tr><td class=\"company_left\">Change Percent</td><td class=\"company_right\">"+trading_change(data.dp)+"</td>"+
    "</table>"+
    "<p id=\"rec_trend\"><span class=\"left_end\">Strong</br>Sell</span>"+
    "<span class=\"color_num color_box1\">"+ data.strongSell +"</span>"+
    "<span class=\"color_num color_box2\">"+ data.sell +"</span>"+
    "<span class=\"color_num color_box3\">"+ data.hold +"</span>"+
    "<span class=\"color_num color_box4\">"+ data.buy +"</span>"+
    "<span class=\"color_num color_box5\">"+ data.strongBuy +"</span>"+
    "<span class=\"right_end\">Strong</br>Buy</span>"+"</p><p class=\"rec_trend\">Recommendation Trends</p>"
    })
    .catch(error => console.error('Error:', error));
}

function charts(ticker) {
    fetch(`/chart?symbol=${ticker}`)
    .then(response => response.json())
    .then(rawData => {
        document.getElementById("cha").innerHTML="<div id=\"plot\"></div>";
    const priceData = rawData.map(item => [item[0], item[1]]);
    const volumeData = rawData.map(item => [item[0], item[2]]);
    // console.log(volumeData)
    // const max_v = Math.max(volumeData.)
    
    const secondElements = volumeData.map(item => item[1]); // Extract the second elements
    const maxSecondElement = Math.max(...secondElements); // Find the max value

    Highcharts.setOptions({
        lang: {
            rangeSelectorZoom: 'Zoom'
        }
    });

    Highcharts.stockChart('plot', {

        rangeSelector: {
            selected: 4,
            inputEnabled: false,
            buttons: [{
                type: 'day',
                count: 7,
                text: '7d',
            },{
                type: 'day',
                count: 15,
                text: '15d',
            },{
                type: 'month',
                count: 1,
                text: '1m',
            },{
                type: 'month',
                count: 3,
                text: '3m',
            },{
                type: 'month',
                count: 6,
                text: '6m',
            }],
        },

        title: {
            text: ' Stock Price ' + ticker + ' ' + today_date(),
        },

        caption: {
            useHTML: true, 
            text: '<a href="https://polygon.io/" target="_blank"> Source: polygon.io</a>',
            align: 'center', 
            verticalAlign: 'top' 
        },

        navigator: {
            series: {
                accessibility: {
                    exposeAsGroupOnly: true
                }
            }
        },
        xAxis: {
            type: 'datetime',
            min: volumeData[0][0],  // Assuming volumeData is sorted by date
            max: volumeData[volumeData.length - 1][0],
            endOnTick: false,
            startOnTick: false,
            showLastLabel: true  // Ensure the last label is shown
        },
        yAxis: [{
            labels:{
                align: 'left',
                x: -30,
            },
            title: {
                text: 'Stock Price',
                offset: 40,
            },
            height: '100%',
            opposite: false
        },{
            labels:{
                align: 'left',
                x:30
            },
            title: {
                text: 'Volumn',
                offset: 80
            },
            height: '100%',
            pointRange: 24 * 3600 * 1000,
            max: 2 * maxSecondElement
        }],

        series: [{
            name: 'Stock Price',
            data: priceData,
            type: 'area',
            threshold: null,
            tooltip: {
                valueDecimals: 2
            },
            fillColor: {
                linearGradient: {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 1
                },
                stops: [
                    [0, Highcharts.getOptions().colors[0]],
                    [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                ]
            }
        },{
            type: 'column',
            name: 'Volumn',
            data: volumeData,
            yAxis: 1,
            color: 'black',
        }],
        plotOptions: {

            column: {
                pointWidth: 5, // Adjust the width of the volume bars
                pointPadding: 0,
                groupPadding: 0.1, // Use a small value to have some space between bars
                pointPlacement: 'on' // Place on the ticks, may need adjustment based on data
            },
        }
    })

    })
    .catch(error => console.error('Error:', error));
}

function latest_news(ticker) {
    fetch(`/news?symbol=${ticker}`)
    .then(response => response.json())
    .then(data => {
        const filteredData = data.filter(item => 
            item.datetime && item.image && item.url && item.headline).slice(0, 5);
        ret_html = ""
        for (i = 0; i < Math.min(5, data.length); i+=1) {
            ret_html += "<div class=\"news\"> <img class=\"news_img\" src='"+filteredData[i].image+"'>"+ "<div class=\"news_text\"><span class=\"heading\"><b>"+filteredData[i].headline+"</b></span>"+
                "<span class=\"content\">" +trading_day(filteredData[i].datetime)+ "</span><a class=\"content\" href=\""+filteredData[i].url+"\" target=\"_blank\">See Original Post</a></div></div>"
        }
        document.getElementById("lat").innerHTML = ret_html;
    })
    .catch(error => console.error('Error:', error));
}

function trading_day(time_e) {
    const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const t = new Date(time_e * 1000);
    const ret = t.getDate() + " " + month[t.getMonth()] + ", " + t.getFullYear();
    return ret;
}

function today_date() {
    d = new Date();
    date = "0";
    const month = ["01","02","03","04","05","06","07","08","09","10","11","12"];
    if (d.getDate() <10) {
        date += String(d.getDate())
    } else {
        date = d.getDate()
    }
    return d.getFullYear() + "-" + month[d.getMonth()] + "-" + date; 
}

function before_30() {
    d = new Date();
    date = "0";
    d.setDate(d.getDate() - 30);
    const month = ["01","02","03","04","05","06","07","08","09","10","11","12"];
    if (d.getDate() <10) {
        date += String(d.getDate())
    } else {
        date = d.getDate()
    }
    return d.getFullYear() + "-" + month[d.getMonth()] + "-" + date; 
}

function trading_change(val) {
    if (val > 0) {
        return val + "<img class=\"arrows\" src=\"/static/img/GreenArrowUp.png\">";
    } else if (val < 0) {
        return val + "<img class=\"arrows\" src='/static/img/RedArrowDown.png'>";
    } else {
        return val;
    }
}