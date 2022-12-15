function onUpload(file, callback) {
  var fileUpload = file;
  var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
  if (regex.test(fileUpload.value.toLowerCase())) {
    if (typeof FileReader != "undefined") {
      var reader = new FileReader();
      reader.onload = function(e) {
        callback(e.target.result);
      };
      reader.readAsText(fileUpload.files[0]);
    } else {
      alert("This browser does not support HTML5.");
    }
  } else {
    alert("Please upload a valid CSV file.");
  }
}

function onCalculate() {
  var snapCapaignsData = document.getElementById("snapCampaignsData");
  var hbAnalyticsV2Report1 = document.getElementById("hbAnalyticsV2Report1");
  var hbAnalyticsV2Report2 = document.getElementById("hbAnalyticsV2Report2");

  var snapCapaignsDataTxt = null;
  var hbAnalyticsV2Report1Txt = null;
  var hbAnalyticsV2Report2Txt = null;

  function saveResult() {
    if (snapCapaignsDataTxt === null || hbAnalyticsV2Report1Txt === null || hbAnalyticsV2Report2Txt === null) return;
    var campaigns = parseCsv(snapCapaignsDataTxt, '",', 1);
    var report1 = parseCsv(hbAnalyticsV2Report1Txt, ",", 1);
    var report2 = parseCsv(hbAnalyticsV2Report2Txt, ",", 1);
    var result = merge(campaigns, report1, report2);

    // draw data table
    const currencyFormatter1 = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2
    });

    const percentFormatter1 = new Intl.NumberFormat("en-US", {
      style: "percent",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    var dataIndexing = [];
    var tb_title_array = [
      "ID",
      "Campaign Name",
      "Status",
      "Spend",
      "Paid Impressions",
      "Paid eCPM",
      "Swipe Ups",
      "eCPSU",
      "Total Revenue",
      "eCPSU",
      "Profit",
      "ROI",
      "eRPSU"
    ];
    // dataIndexing[0] = tb_title_array;
    var d_index = 0;
    Object.keys(result).forEach(key => {
      var arr = result[key].map((val, index) => {
        //cut floats
        if (index === 3 || index === 8 || index === 9 || index === 10 || index === 12)
          val = currencyFormatter1.format(val);
        if (index === 11) {
          val = percentFormatter1.format(val);
        }
        return val;
      });
      dataIndexing[d_index] = arr;
      d_index++;
    });

    var table_data = "";
    for (var count = 0; count < dataIndexing.length; count++) {
      var cell_data = dataIndexing[count];
      table_data += "<tr>";
      for (var cell_count = 0; cell_count < cell_data.length; cell_count++) {
        var number = Number(cell_data[cell_count].replace(/[^0-9.-]+/g, ""));
        // if (count === 0) {
        //   // table_data += "<th>" + cell_data[cell_count] + "</th>";
        // } else {
        var bgColor = number < 0 ? "#FFC7CE" : "#C6EFCE";
        var fontColor = number < 0 ? "#CF5075" : "#2D6100";
        if (cell_count === 3) {
          table_data +=
            '<td style="border: 1px solid white; background: ' +
            bgColor +
            "; color: " +
            fontColor +
            ';">' +
            cell_data[cell_count] +
            "</td>";
        } else {
          table_data +=
            '<td style="border: 1px solid white; background: ' +
            bgColor +
            "; color: " +
            fontColor +
            ';">' +
            cell_data[cell_count] +
            "</td>";
        }
        // }
      }
      table_data += "</tr>";
    }
    $("#snapchat_optimization_table tbody").html(table_data);

    $("#snapchat_optimization_table").sumtabletotal({
      placeholder: "#",
      // totalText: 'Total',
      totalIndexArry: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    });
    $("#snapchat_optimization_table").tablesort();
    $("thead th.spend").data("sortBy", function(th, td, tablesort) {
      return Number(td.text().replace(/[^0-9.-]+/g, ""));
    });
    $("thead th.paid_imp").data("sortBy", function(th, td, tablesort) {
      return Number(td.text().replace(/[^0-9.-]+/g, ""));
    });
    $("thead th.paid_ecpm").data("sortBy", function(th, td, tablesort) {
      return Number(td.text().replace(/[^0-9.-]+/g, ""));
    });
    $("thead th.swipe_users").data("sortBy", function(th, td, tablesort) {
      return Number(td.text().replace(/[^0-9.-]+/g, ""));
    });
    $("thead th.ecpsu1").data("sortBy", function(th, td, tablesort) {
      return Number(td.text().replace(/[^0-9.-]+/g, ""));
    });
    $("thead th.total_rev").data("sortBy", function(th, td, tablesort) {
      return Number(td.text().replace(/[^0-9.-]+/g, ""));
    });
    $("thead th.ecpsu2").data("sortBy", function(th, td, tablesort) {
      return Number(td.text().replace(/[^0-9.-]+/g, ""));
    });
    $("thead th.profit").data("sortBy", function(th, td, tablesort) {
      return Number(td.text().replace(/[^0-9.-]+/g, ""));
    });
    $("thead th.roi").data("sortBy", function(th, td, tablesort) {
      return Number(td.text().replace(/[^0-9.-]+/g, ""));
    });
    $("thead th.erpsu").data("sortBy", function(th, td, tablesort) {
      return Number(td.text().replace(/[^0-9.-]+/g, ""));
    });

    $("tr:last").hide();

    // download CSV
    // var resultStr = resultToStr(result);
    // var uriContent = "data:application/octet-stream," + encodeURIComponent(resultStr);
    // saveAs(uriContent, `Luke's Snapchat PNL Optimization.csv`);
  }

  onUpload(snapCapaignsData, snapCallback);
  function snapCallback(value) {
    snapCapaignsDataTxt = value;
    saveResult();
  }
  onUpload(hbAnalyticsV2Report1, hbCallback1);
  function hbCallback1(value) {
    hbAnalyticsV2Report1Txt = value;
    saveResult();
  }
  onUpload(hbAnalyticsV2Report2, hbCallback2);
  function hbCallback2(value) {
    hbAnalyticsV2Report2Txt = value;
    saveResult();
  }
}

function onExtract() {
  var snapCapaignsData = document.getElementById("snapCampaignsData");
  var hbAnalyticsV2Report1 = document.getElementById("hbAnalyticsV2Report1");
  var hbAnalyticsV2Report2 = document.getElementById("hbAnalyticsV2Report2");

  var snapCapaignsDataTxt = null;
  var hbAnalyticsV2Report1Txt = null;
  var hbAnalyticsV2Report2Txt = null;

  function saveResult() {
    if (snapCapaignsDataTxt === null || hbAnalyticsV2Report1Txt === null || hbAnalyticsV2Report2Txt === null) return;
    var campaigns = parseCsv(snapCapaignsDataTxt, '",', 1);
    var report1 = parseCsv(hbAnalyticsV2Report1Txt, ",", 1);
    var report2 = parseCsv(hbAnalyticsV2Report2Txt, ",", 1);
    var result = merge(campaigns, report1, report2);

    // draw data table
    const currencyFormatter1 = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2
    });

    const percentFormatter1 = new Intl.NumberFormat("en-US", {
      style: "percent",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    var dataIndexing = [];
    var tb_title_array = [
      "ID",
      "Campaign Name",
      "Status",
      "Spend",
      "Paid Impressions",
      "Paid eCPM",
      "Swipe Ups",
      "eCPSU",
      "Total Revenue",
      "eCPSU",
      "Profit",
      "ROI",
      "eRPSU"
    ];
    dataIndexing[0] = tb_title_array;
    var d_index = 1;
    Object.keys(result).forEach(key => {
      var arr = result[key].map((val, index) => {
        //cut floats
        if (index === 3 || index === 8 || index === 9 || index === 10 || index === 12)
          val = currencyFormatter1.format(val);
        if (index === 11) {
          val = percentFormatter1.format(val);
        }
        return val;
      });
      dataIndexing[d_index] = arr;
      d_index++;
    });

    var table_data = '<table class="table table-bordered table-striped">';
    for (var count = 0; count < dataIndexing.length; count++) {
      var cell_data = dataIndexing[count];
      table_data += "<tr>";
      for (var cell_count = 0; cell_count < cell_data.length; cell_count++) {
        var number = Number(cell_data[cell_count].replace(/[^0-9.-]+/g, ""));
        if (count === 0) {
          table_data += "<th>" + cell_data[cell_count] + "</th>";
        } else {
          var bgColor = number < 0 ? "#FFC7CE" : "#C6EFCE";
          var fontColor = number < 0 ? "#CF5075" : "#2D6100";
          if (cell_count === 3) {
            table_data +=
              '<td style="border: 1px solid white; background: ' +
              bgColor +
              "; color: " +
              fontColor +
              ';">' +
              cell_data[cell_count] +
              "</td>";
          } else {
            table_data +=
              '<td style="border: 1px solid white; background: ' +
              bgColor +
              "; color: " +
              fontColor +
              ';">' +
              cell_data[cell_count] +
              "</td>";
          }
        }
      }
      table_data += "</tr>";
    }
    table_data += "</table>";
    // $("#snapchat_optimization_table").html(table_data);

    // $("#snapchat_optimization_table").sumtabletotal({
    //   placeholder: "#",
    //   // totalText: 'Total',
    //   totalIndexArry: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    // });

    var totalRowArray = ["Total", "#", "#"];
    for (let index = 0; index < 10; index++) {
      totalRowArray.push(0.0);
    }
    Object.keys(result).forEach(key => {
      for (let index = 0; index < result[key].length; index++) {
        const element = result[key][index];
        if ($.isNumeric(element) && index !== 11) {
          totalRowArray[index] += parseFloat(result[key][index]).toFixed(2) * 1;
        }
      }
    });
    totalRowArray[11] = totalRowArray[10] / totalRowArray[3];
    result.total = totalRowArray;
    // download CSV
    var resultStr = resultToStr(result);
    var uriContent = "data:application/octet-stream," + encodeURIComponent(resultStr);
    saveAs(uriContent, `Luke's Snapchat PNL Optimization.csv`);
  }

  onUpload(snapCapaignsData, snapCallback);
  function snapCallback(value) {
    snapCapaignsDataTxt = value;
    saveResult();
  }
  onUpload(hbAnalyticsV2Report1, hbCallback1);
  function hbCallback1(value) {
    hbAnalyticsV2Report1Txt = value;
    saveResult();
  }
  onUpload(hbAnalyticsV2Report2, hbCallback2);
  function hbCallback2(value) {
    hbAnalyticsV2Report2Txt = value;
    saveResult();
  }
}

function parseCsv(data, splitter, keyCell) {
  const lines = data.split("\n");
  return lines.reduce((acc, line) => {
    const cells = line.split(splitter).map(cell => cell.replace(/("|\r)/g, ""));
    if (!cells[keyCell]) return acc;
    const cmpNumber = cells[keyCell].match(/\d+/);
    if (cmpNumber === null) return acc;
    acc[cmpNumber[0]] = cells;
    return acc;
  }, {});
}

function initResult(campaigns) {
  const result = { ...campaigns };
  Object.keys(result).forEach(key => {
    for (let i = 0; i < 5; i++) result[key].push(0);
    if (result[key][6] !== "0.000") result[key][9] = parseFloat(result[key][3]) / parseFloat(result[key][6]); //eCPSU = spend / swipe ups
  });
  return result;
}

function merge(campaigns, report1, report2) {
  const result = initResult({ ...campaigns });
  Object.keys(report1).forEach(key => {
    if (result[key] && report2[key]) {
      result[key][8] = parseFloat(report1[key][6]) + parseFloat(report2[key][6]); //total revenue
      result[key][10] = result[key][8] - parseFloat(result[key][3]); //Profit = total revenue - spend
      if (result[key][3] !== "0.000") result[key][11] = result[key][10] / parseFloat(result[key][3]); //ROI = profit / spend
      if (result[key][6] !== "0.000") result[key][12] = result[key][8] / parseFloat(result[key][6]); //eRPSU = total revenue / swipe ups
    }
  });
  return result;
}

function resultToStr(result) {
  let resultStr =
    "ID,Campaign Name,Status,Spend,Paid Impressions,Paid eCPM,Swipe Ups,eCPSU,Total Revenue,eCPSU,Profit,ROI,eRPSU\n";

  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  });

  const percentFormatter = new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  Object.keys(result).forEach(key => {
    var arr = result[key].map((val, index) => {
      //cut floats
      if (index === 3 || index === 8 || index === 9 || index === 10 || index === 12)
        val = currencyFormatter.format(val);
      if (index === 11) {
        val = percentFormatter.format(val);
      }
      return val;
    });
    const valuesStr = arr.map(val => `"${val}"`).join(",");
    resultStr += valuesStr + "\n";
  });
  return resultStr;
}

function saveAs(uri, filename) {
  var link = document.createElement("a");
  if (typeof link.download === "string") {
    document.body.appendChild(link); // Firefox requires the link to be in the body
    link.download = filename;
    link.href = uri;
    link.click();
    document.body.removeChild(link); // remove the link when done
  } else {
    location.replace(uri);
  }
}
