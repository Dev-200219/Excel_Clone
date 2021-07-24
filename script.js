let rowNbrSec = document.querySelector(".row-number-section")
let lastCellSelected;
let selectedCellDiv = document.querySelector(".selected-cell-div");
let columnNbrSec = document.querySelector(".column-number-section");
let cellSec = document.querySelector(".cell-section");
let dataObj = {};
let formulaSection = document.querySelector(".formula-input-section")
let body = document.querySelector("body");
let allAlignmentOptions = document.querySelectorAll(".alignment span")
let fileBtn = document.querySelector(".file");
let bgColor = document.querySelectorAll(".color-options span")[0];
let textColor = document.querySelectorAll(".color-options span")[1];
let fontFamilyBtn = document.querySelector(".font-family");
let fontSizeBtn = document.querySelector(".font-size");
let fileName = document.querySelector(".title");
let openFileBtn = document.querySelector(".load-file");
let bold = document.querySelectorAll(".bold-italic-under span")[0];
let italic = document.querySelectorAll(".bold-italic-under span")[1];
let underline = document.querySelectorAll(".bold-italic-under span")[2];
let leftAlign = allAlignmentOptions[0];
let centerAlign = allAlignmentOptions[1];
let rightAlign = allAlignmentOptions[2];
let downloadBtn = document.querySelector(".download");

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
            isUnderline: false,
            fontFamily : "Montserrat",
            fontSize : 12,

        }
        dataObj[cellAddress] = obj;

        cellDiv.addEventListener("click", function (e) {
            if (lastCellSelected) {
                lastCellSelected.classList.remove("cell-selected");
            }
            e.currentTarget.classList.add("cell-selected");
            lastCellSelected = e.currentTarget;

            let cellObj = dataObj[e.currentTarget.getAttribute("data-address")];
            fontFamilyBtn.value = cellObj.fontFamily;
            fontSizeBtn.value = cellObj.fontSize;

            if(cellObj.isBold)
            bold.classList.add("selected");
            else
            bold.classList.remove("selected");

            if(cellObj.isItalic)
            italic.classList.add("selected")
            else
            italic.classList.remove("selected");

            if(cellObj.isUnderline)
            underline.classList.add("selected");
            else
            underline.classList.remove("selected");

            if(cellObj.align == "left")
            {
                leftAlign.classList.add("selected");
                rightAlign.classList.remove("selected");
                centerAlign.classList.remove("selected");
            }
            else if(cellObj.align == "right")
            {
                leftAlign.classList.remove("selected");
                centerAlign.classList.remove("selected");
                rightAlign.classList.add("selected");
            }
            else
            {
                leftAlign.classList.remove("selected");
                centerAlign.classList.add("selected");
                rightAlign.classList.remove("selected");
            }


            
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

openFileBtn.addEventListener("click", function(){
    
    let isFileDivPresent = document.querySelector(".saved-files");
    if(isFileDivPresent)
    {
        isFileDivPresent.remove();
        return;
    }

    let localStorageItems = Object.keys(localStorage)
    
    if(localStorageItems.length > 0)
    {
    let selectSheetDiv = document.createElement("div");
    selectSheetDiv.classList.add("saved-files");
    
    for(let i = 0; i < localStorageItems.length; i++)
    {
        let name = localStorageItems[i];
        let fileDiv = document.createElement("div");
        fileDiv.classList.add("single-file-div");
        fileDiv.innerText = name;
        
        fileDiv.addEventListener("click", function(e){
            loadSheet(e.currentTarget.innerText);
            selectSheetDiv.remove();
            
        })  
        selectSheetDiv.append(fileDiv);
    }
    
    body.append(selectSheetDiv);
    }
    
    function loadSheet(sheetName)
    {
        fileName.innerText = sheetName;
        let sheet = localStorage.getItem(sheetName);
        sheet = JSON.parse(sheet);
        dataObj = sheet;
    
        for(let cell in dataObj)
        {
            let cellDiv = document.querySelector(`[data-address = ${cell}]`);
    
            let value = dataObj[cell].value;
            let alignment = dataObj[cell].align;
            let bgColor = dataObj[cell].bgColor;
            let fontColor = dataObj[cell].color;
            let isBold = dataObj[cell].isBold;
            let isItalic = dataObj[cell].isItalic;
            let isUnderline = dataObj[cell].isUnderline;
            let fontFam = dataObj[cell].fontFamily;
            let fontS = dataObj[cell].fontSize;
    
            if(value)
            cellDiv.innerText = value;
            cellDiv.style.fontFamily = fontFam;
            cellDiv.style.fontSize = `${Number(fontS)}px`;
            cellDiv.style.color = fontColor;
            cellDiv.style.backgroundColor = bgColor;
            if(isUnderline)
            cellDiv.style.textDecoration = "underline";
            if(isItalic)
            cellDiv.style.fontStyle = "italic";
            if(isBold)
            cellDiv.style.fontWeight = "bold";
            cellDiv.style.textAlign = alignment;
        }
    }
})

// let fileUpload = document.createElement("input");
// fileUpload.setAttribute("type", "file");
// body.append(fileUpload);