//sumtabletotal.js

if (typeof jQuery === "undefined") {
  throw new Error("jquery-confirm requires jQuery");
}
// numerator and denominator
(function($) {
  var pluginName = "sumtabletotal",
    defaults = {
      colspan: 1,
      totalText: "Total",
      color: "#000000",
      placeholder: "-",
      significant: 2
    };

  // The  plugin constructor
  function Plugin(element, options) {
    this.element = element;

    this.settings = $.extend({}, defaults, options);
    this.total = [];
    this.calcTotal();
  }

  Plugin.prototype = {
    calcTotal: function() {
      var e = this;
      var t = $(e.element);
      //calculate count of rows and columns
      var tdCount = t.find("tr:last td").length;

      //new Total result object
      e.total = new Array(tdCount);

      if (e.settings.totalIndexArry) {
        for (var i = 0; i < e.settings.totalIndexArry.length; i++) {
          e.total[e.settings.totalIndexArry[i]] = 0.0;
        }
        t.find("tr:not(:first)").each(function(i, item) {
          var tds = $(item).find("td");
          for (var j = 0; j < e.settings.totalIndexArry.length; j++) {
            e.total[e.settings.totalIndexArry[j]] += !isNaN(
              Number(
                $(tds[e.settings.totalIndexArry[j]])
                  .text()
                  .replace(/[^0-9.-]+/g, "")
              )
            )
              ? Number(
                  $(tds[e.settings.totalIndexArry[j]])
                    .text()
                    .replace(/[^0-9.-]+/g, "")
                )
              : 0.0;
          }
        });
      }
      //Calculating percentage according e.total
      if (e.settings.rateObjectArry) {
        for (var obj in e.settings.rateObjectArry) {
          if (!isNaN(e.settings.rateObjectArry[obj].index)) {
            e.total[e.settings.rateObjectArry[obj].index] = 0.0;
          } else {
            console.error("Rate Object error!");
          }
        }
        for (var o in e.settings.rateObjectArry) {
          if (
            !isNaN(e.total[e.settings.rateObjectArry[o].denominator]) &&
            !isNaN(e.total[e.settings.rateObjectArry[o].numerator]) &&
            e.total[e.settings.rateObjectArry[o].denominator] !== 0
          ) {
            e.total[e.settings.rateObjectArry[o].index] =
              e.total[e.settings.rateObjectArry[o].numerator] / e.total[e.settings.rateObjectArry[o].denominator];
          } else {
            e.total[e.settings.rateObjectArry[o].index] = 0;
          }
        }
      }
      e.appendTotalRow();
    },
    appendTotalRow: function() {
      var e = this;
      var t = $(e.element);
      console.log("#################################", t);
      if (e.settings.colspan === undefined) {
        e.settings.colspan = 1;
      }
      if (e.settings.significant === undefined) {
        e.settings.significant = 2;
      }
      //append total row
      const currencyFormatter2 = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2
      });

      const percentFormatter2 = new Intl.NumberFormat("en-US", {
        style: "percent",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
      var totalRow =
        "<tr style='color: " +
        e.settings.color +
        ";'><td colspan='" +
        e.settings.colspan +
        "'>" +
        e.settings.totalText +
        "</td>";
      for (var i = 1; i < e.total.length; i++) {
        if (!isNaN(e.total[i])) {
          var isRate = false;
          for (var k in e.settings.rateObjectArry) {
            if (i === e.settings.rateObjectArry[k].index) {
              totalRow += "<td>" + parseFloat((e.total[i] * 1000) / 10).toFixed(e.settings.significant) + "%</td>";
              isRate = true;
            }
          }
          if (!isRate) {
            if (i === 11) {
              totalRow += "<td>" + percentFormatter2.format(parseFloat(e.total[10] / e.total[3])) + "</td>";
            } else if (i === 3 || i === 8 || i === 9 || i === 10 || i === 12) {
              totalRow += "<td>" + currencyFormatter2.format(parseFloat(e.total[i])) + "</td>";
            } else {
              totalRow += "<td>" + parseFloat(e.total[i]).toFixed(e.settings.significant) + "</td>";
            }
          }
        } else {
          if (i < e.settings.colspan) {
            continue;
          }
          totalRow += "<td>" + e.settings.placeholder + "</td>";
        }
      }
      totalRow += "</tr>";
      totalRow += "<tfooter>" + totalRow + "</tfooter>";
      t.find("tbody").after(totalRow);
    }
  };

  $.fn[pluginName] = function(options) {
    var e = this;
    e.each(function() {
      if (!$.data(e, "plugin_" + pluginName)) {
        $.data(e, "plugin_" + pluginName, new Plugin(this, options));
      }
    });

    // chain jQuery functions
    return e;
  };
})(jQuery);
