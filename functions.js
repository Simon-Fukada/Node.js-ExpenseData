function AddtoDates(item, index)
{
    chart.data.labels.push(item.Expense_date);
    chart.update(); 
}

function AddtoPrices(item, index)
{
    chart.data.datasets.forEach((dataset) => {
      console.log("price loop: "+item.Expense_price);
        dataset.data.push(item.Expense_price);
    });
        chart.update();
}

function AddtoDonught(item, index)
{
  chart2.data.datasets.forEach((dataset) => {
    console.log("DONUGHT: "+item.x);
        dataset.data.push(item.x);
    });
        chart2.update();

}

function fillGraph()
{
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        result = this.responseText;
        graphObj = JSON.parse(result);
        console.log(graphObj);
        dateObj = JSON.parse(graphObj[0]);
        dateArray = dateObj.recordset;
        dateArray.forEach(AddtoDates);

        priceObj = JSON.parse(graphObj[1]);
        priceArray = priceObj.recordset;
        console.log("Price Array: "+ priceArray);
        priceArray.forEach(AddtoPrices);

        donughtObj = JSON.parse(graphObj[2]);
        donughtArray = donughtObj.recordset;
        console.log("Donught Array: "+ donughtArray.x);
        donughtArray.forEach(AddtoDonught);
      }
    };
    var user = document.getElementById('user').value;
    xhttp.open("POST", "/getGraph", true);
    xhttp.send('{"user":"'+user+'"}');
}

function submit() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
       document.getElementById("result").innerHTML = this.responseText;
      }
    };
    var date = document.getElementById('date').value;
    var spent = document.getElementById('spent').value;
    var note = document.getElementById('note').value;
    var user = document.getElementById('user').value;
    xhttp.open("POST", "insert", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send('{ "date":"'+date+'", "spent":'+spent+', "note":"'+note+'", "user":"'+user+'" }');
  }


  function submit2() {
    fillGraph();
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
       result = this.responseText;
       statsObj = JSON.parse(result);

       Mean = statsObj.recordsets[0][0].Means;
       Sum = statsObj.recordsets[0][0].Sum;
       StdDev = statsObj.recordsets[0][0].StdDev;
       Count = statsObj.recordsets[0][0].Count;

       document.getElementById('mean').innerHTML = Mean;
       document.getElementById('sum').innerHTML = Sum;
       document.getElementById('standarDeviation').innerHTML = StdDev;
       document.getElementById('count').innerHTML = Count;


       console.log("Mean: " + Mean);
       console.log("Sum: " + Sum);
       console.log("StdDev: " + StdDev);
       console.log("Count: " + Count);
      }
    };
    var user = document.getElementById('user').value;
    xhttp.open("POST", "getStatistics", true);
    xhttp.send('{"user":"'+user+'"}');
  }