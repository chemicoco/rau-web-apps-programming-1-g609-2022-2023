class Tranz
{
    data;
    suma;
    tip;
    parte;
    constructor(a, b, c, d){
        this.data = a;
        this.suma = b;
        this.tip = c;
        this.parte = d;
    }
}

// // TODO: 
// 1. Read from file (client/assets/conturi.json)
// 2. Parse string using JSON.parse => list of objects
const CONTURI = [];

// read users from file
const USERS = [];

// read tranzactions from file (list [Tranz])
const HISTORICAL_TRANSACTIONS = [];

function findObject(objectPropertyName, objectPropertyValue, listOfObjects) {
    for (const obj in listOfObjects) {
        if (obj[objectPropertyName] == objectPropertyValue) {
            return obj;
        }
    }
    return {};
}

let loggedUser = sessionStorage.getItem("loggedIn");
var currentUser;
for (const user of CONTURI)
{
    if (user.username == loggedUser)
    {
        currentUser=user;
    }
}

const NUME_STYLE = "color: white; font-size: 60px; padding-top: 60px";
const INFO_STYLE = "color: white; font-size: 20px";
const TABEL_STYLE = "border: 1px solid white; width: 100%; background-color: black";
const BALANTA_STYLE = "color: white; font-size: 40px; padding-top: 30px";

const accountSection = document.getElementById("main-section");
const nume = document.createElement("div");
nume.innerText = "Cont curent: " + currentUser.titular;
nume.style = NUME_STYLE;
accountSection.appendChild(nume);

const info = document.createElement("div");
info.innerText = "Cont nr.: " + currentUser.numarCont + " - " + currentUser.iban;
info.style = INFO_STYLE;
accountSection.appendChild(info);

const linie = document.createElement("hr");
accountSection.appendChild(linie);

const spatiu = document.createElement("br");
accountSection.appendChild(spatiu);

const tabel = document.createElement("table");
tabel.style = TABEL_STYLE;
const categorii = document.createElement("tr");
const data = document.createElement("th");
data.innerText = "Data tranzactiei";
data.style = "color: white; font-size: 20px; border: 1px solid white; width: 20%";
const parte = document.createElement("th");
parte.innerText = "Platitor/Destinatar";
parte.style = "color: white; font-size: 20px; border: 1px solid white; width: 70%";
const suma = document.createElement("th");
suma.innerText = "Valoare";
suma.style = "color: white; font-size: 20px; border: 1px solid white; width: 10%";

categorii.appendChild(data);
categorii.appendChild(parte);
categorii.appendChild(suma);
tabel.appendChild(categorii);
for (const tranzactie of currentUser.ultimeleTranzactii)
{
    const oTranz = document.createElement("tr");
    const dataTranz = document.createElement("td");
    dataTranz.innerText = tranzactie.data;
    dataTranz.style = "color: white; font-size: 20px; border: 1px solid white; width: 20%";
    const parteTranz = document.createElement("td");
    parteTranz.innerText = tranzactie.parte;
    parteTranz.style = "color: white; font-size: 20px; border: 1px solid white; width: 70%";
    const sumaTranz = document.createElement("td");
    if (tranzactie.tip == "incasare")
    {
        sumaTranz.innerText = tranzactie.suma;
    }
    else if (tranzactie.tip == "plata")
    {
        sumaTranz.innerText = "-" + tranzactie.suma;
    }
    sumaTranz.style = "color: white; font-size: 20px; border: 1px solid white; width: 10%";
 
    oTranz.appendChild(dataTranz);
    oTranz.appendChild(parteTranz);
    oTranz.appendChild(sumaTranz);
    tabel.appendChild(oTranz);
}
accountSection.appendChild(tabel);

const balanta = document.createElement("div");
balanta.innerText = "Balanta: " + currentUser.balanta;
balanta.id = "balantaTotala";
balanta.style = BALANTA_STYLE;
accountSection.appendChild(balanta);

function alegeTranzactie()
{
    var bifat = document.getElementsByName("tip-tranzactie");
    var element;
    if (bifat[0].checked)
    {
        element = document.querySelector('.plata');
        element.classList.remove('ascund');
        element2 = document.querySelector('.incasare');
        element2.classList.add('ascund');   
    }
    else{
        element = document.querySelector(".incasare");
        element.classList.remove("ascund");   
        element2 = document.querySelector(".plata");
        element2.classList.add("ascund");
    }
}

function faTranzactie()
{
    var bifat = document.getElementsByName("tip-tranzactie");
    const azi = new Date();
    let dat = azi.getFullYear() + "-" + (azi.getMonth()+1) + "-" + azi.getDate(); //nu stiu de ce, dar calculatorul meu se numara luni incepand cu 0
    var sum;
    var tip;
    var part;
    var tranzactieValida=true;
    if (bifat[0].checked)
    {
        sum = parseFloat(document.getElementById("sumaplatita").value);
        if (sum > currentUser.balanta)
        {
            tranzactieValida=false;
            alert("Nu ai destui bani in cont!");
        }
        else
        {
            tip = "plata";
            part = document.getElementById("destinatar").value;
            currentUser.balanta = currentUser.balanta - sum;
            document.getElementById("balantaTotala").innerText = "Balanta: " + currentUser.balanta.toFixed(2);
        }
    }
    else
    {
        sum = parseFloat(document.getElementById("sumaincasata").value);
        tip = "incasare";
        part = document.getElementById("platitor").value;
        currentUser.balanta = currentUser.balanta + sum;
        document.getElementById("balantaTotala").innerText = "Balanta: " + currentUser.balanta.toFixed(2);
    }
    if (tranzactieValida)
    {    
     let noutranz = new Tranz(dat, sum, tip, part);
    currentUser.ultimeleTranzactii.push(noutranz);

    const oTranz = document.createElement("tr");
    const dataTranz = document.createElement("td");
    dataTranz.innerText = dat;
    dataTranz.style = "color: white; font-size: 20px; border: 1px solid white; width: 20%";
    const parteTranz = document.createElement("td");
    parteTranz.innerText = part;
    parteTranz.style = "color: white; font-size: 20px; border: 1px solid white; width: 70%";
    const sumaTranz = document.createElement("td");
    if (noutranz.tip == "incasare")
    {
        sumaTranz.innerText = sum;
    }
    else if (noutranz.tip == "plata")
    {
        sumaTranz.innerText = sum*-1;
    }
    sumaTranz.style = "color: white; font-size: 20px; border: 1px solid white; width: 10%";
 
    oTranz.appendChild(dataTranz);
    oTranz.appendChild(parteTranz);
    oTranz.appendChild(sumaTranz);
    tabel.appendChild(oTranz);
    document.getElementById("destinatar").value = "";
    document.getElementById("platitor").value = "";
    document.getElementById("sumaplatita").value = "";
    document.getElementById("sumaincasata").value = "";
    }
}
