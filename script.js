let rowNbrSec = document.querySelector(".row-number-section")
let lastCellSelected;
let selectedCellDiv = document.querySelector(".selected-cell-div");
let columnNbrSec = document.querySelector(".column-number-section");
let cellSec = document.querySelector(".cell-section");
let dataObj = {};
let formulaSection = document.querySelector(".formula-input-section")

formulaSection.addEventListener("keypress", function(e){

    if(e.key == "Enter")
    {  
        if(!lastCellSelected)
        return;

        let currCellAddress = lastCellSelected.getAttribute(`data-address`)
        let currCellObj = dataObj[currCellAddress];
        let newFormula = e.currentTarget.value;

        if(newFormula == "")
        return;
        
        currCellObj.formula = newFormula;

        //for each cell in upstream we remove ourselves from it's downstream and then empty our upstream
        for(let i = 0; i < currCellObj.upstream.length; i++)
        {
            removeFromDownstream(currCellObj.upstream[i], currCellAddress);
        }
        currCellObj.upstream = [];

        newFormula = newFormula.split(" ");
        currCellObj.upstream = newFormula.filter(function(ele){
            if(ele != '*' && ele != '-' && ele != '/' && ele != '+' && !(ele >= "0" && ele <= "9") )
            return ele;
        })

        for(let i = 0; i < currCellObj.upstream.length; i++)
        {
            addToDownstream(currCellObj.upstream[i], currCellAddress);
        }

        updateCell(currCellAddress);
        e.currentTarget.value = "";
        dataObj[currCellAddress] = currCellObj;
        
    }
})

//row numbers aur column numbers ki independent srolling ke liye
//cell section pr scroll ka event listener lgaya ki jitna cell's ka section left ya down scroll hoga utna hi hum row numbers ko upar scroll krdenge aur column numbers ko left scroll krdenge using translate X and Y properties aur kitna scroll krna hai yeh e.currentTarget.scrollLeft ya scrollTop se calculate krlenge
cellSec.addEventListener("scroll", function (e) {
    columnNbrSec.style.transform = `translateX(-${e.currentTarget.scrollLeft}px)`
    rowNbrSec.style.transform = `translateY(-${e.currentTarget.scrollTop}px)`
})

for (let i = 1; i <= 100; i++) {
    let div = document.createElement("div");
    div.innerText = i;
    div.classList.add("row-number");
    rowNbrSec.append(div)
}


for (let i = 0; i < 26; i++) {
    let div = document.createElement("div");
    div.innerText = String.fromCharCode(65 + i);
    div.classList.add("column-number");
    columnNbrSec.append(div)
}


for (let i = 1; i <= 100; i++) {
    let rowDiv = document.createElement("div");
    rowDiv.classList.add("row")

    for (let j = 0; j < 26; j++) {
        let asciiKey = String.fromCharCode(65 + j);
        let cellAddress = asciiKey + i;

        let cellDiv = document.createElement("div");

        cellDiv.addEventListener("input", function(e){

            if(e.currentTarget.innerText == "")
            {
                dataObj[cellAddress].value = 0; 
                return;
            }

            let currCellAddress = e.currentTarget.getAttribute("data-address");
            let currCellObj = dataObj[currCellAddress];
            currCellObj.value = e.currentTarget.innerText;
            currCellObj.formula = undefined;
            //for each cell in upstream we remove ourselves from it's downstream and then empty our upstream
            for(let i = 0; i < currCellObj.upstream.length; i++)
            {
                removeFromDownstream(currCellObj.upstream[i], currCellAddress);
            }
            currCellObj.upstream = [];

            //jo cells is pr dependent hai unki value ko bhi update krna hoga aur unn cells ka address downstream wali array mai hoga
            for(let  i = 0; i < currCellObj.downstream.length; i++)
            {
                updateCell(currCellObj.downstream[i]);
            }
            
            dataObj[currCellAddress] = currCellObj;
        })

        cellDiv.classList.add("cell");
        cellDiv.setAttribute("data-address", cellAddress);
        cellDiv.setAttribute("contenteditable", true);

        let obj = {
            value: undefined,
            formula: undefined,
            upstream: [],
            downstream: [],
            align: "left",
            color: "black",
            bgColor: "white",
            isBold: false,
            isItalic: false,
            isUnderline: false

        }
        dataObj[cellAddress] = obj;

        cellDiv.addEventListener("keypress", function(e){
            console.log(e.keyCode);

            if(e.keyCode == 9)
            {
                if (lastCellSelected) {
                    lastCellSelected.classList.remove("cell-selected");
                }
                e.currentTarget.classList.add("cell-selected");
                lastCellSelected = e.currentTarget;
    
                selectedCellDiv.innerText = e.currentTarget.getAttribute("data-address");
            }

        })

        cellDiv.addEventListener("click", function (e) {
            if (lastCellSelected) {
                lastCellSelected.classList.remove("cell-selected");
            }
            e.currentTarget.classList.add("cell-selected");
            lastCellSelected = e.currentTarget;

            selectedCellDiv.innerText = e.currentTarget.getAttribute("data-address");

        })

        rowDiv.append(cellDiv);
    }

    cellSec.append(rowDiv);
}

function removeFromDownstream(parentCell, childCell)
{
    //1. get parent's downstream
    let parentDownstream = dataObj[parentCell].downstream;

    //2. remove child from parent downstream
    let filteredDownstream = [];
    for(let  i =0; i < parentDownstream.length; i++)
    {
        if(parentDownstream[i] != childCell)
        filteredDownstream.push(parentDownstream[i]);
    }

    //3. update parent's downstream
    dataObj[parentCell].downstream = filteredDownstream;
}

function updateCell(cell)
{
    let cellObj = dataObj[cell]
    let formula = cellObj.formula;// a1+ b1
    let cellUpstream = cellObj.upstream;//[a1, b1]
    //jin cells pr dependent hai unki values ko store kra liya ek obj mai unki key ke saamne
    let valObj = {};
    for(let  i = 0; i < cellUpstream.length; i++)
    {
        valObj[cellUpstream[i]] = dataObj[cellUpstream[i]].value;
        //{a1:20, b1:30}
    }
    for(let key in valObj)
    {
        formula = formula.replace(key, valObj[key]);//20 + 30
    }
    let newValue = eval(formula);//50
    dataObj[cell].value = newValue;

    let currCellDiv = document.querySelector(`[data-address=${cell}]`);
    currCellDiv.innerText = newValue;

    //jo cell ab update hua uske children bhi toh update hone chahiye kyuki vo iss pr dependent hai aur iski value change hui hai
    for(let i in cellObj.downstream)
    {
        updateCell(cellObj.downstream[i]);
    }

}

function addToDownstream(parentCell, childCell) {
  dataObj[parentCell].downstream.push(childCell);   
}