fontSize = [2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38]

for(let i = 0; i < fontSize.length; i++)
{
    let oldHTML = fontSizeBtn.innerHTML;
    let newHTML = oldHTML + `<option>${fontSize[i]}</option>`;
    fontSizeBtn.innerHTML = newHTML;
}

fontSizeBtn.value = 12;


fonts = ["Sans-Serif", "Arial", "Roboto", "Times New Roman", "Segoe UI", "Courier New"];
for(let i = 0; i < fonts.length; i++)
{
    let oldHTML = fontFamilyBtn.innerHTML;
    let newHTML = oldHTML + `<option>${fonts[i]}</option>`;
    fontFamilyBtn.innerHTML = newHTML;
}

let leftAlign = allAlignmentOptions[0];
let centerAlign = allAlignmentOptions[1];
let rightAlign = allAlignmentOptions[2];
let lastAlignSelected = "left";

leftAlign.addEventListener("click", function(e){

    if(lastCellSelected)
    {
        lastCellSelected.style.textAlign = "left";
        let address = lastCellSelected.getAttribute("data-address");
        dataObj[address].align = "left";
    }
})

centerAlign.addEventListener("click", function(e){

    if(lastCellSelected)
    {
        let address = lastCellSelected.getAttribute("data-address");
        dataObj[address].align = "center";
        lastCellSelected.style.textAlign = "center";
    }
})

rightAlign.addEventListener("click", function(e){

    if(lastCellSelected)
    {
        let address = lastCellSelected.getAttribute("data-address");
        dataObj[address].align = "right";
        lastCellSelected.style.textAlign = "right";
    }
})

let bold = document.querySelectorAll(".bold-italic-under span")[0];
let italic = document.querySelectorAll(".bold-italic-under span")[1];
let underline = document.querySelectorAll(".bold-italic-under span")[2];

bold.addEventListener("click", function(){
    if(lastCellSelected)
    {
        let address = lastCellSelected.getAttribute("data-address");
        
        if(!dataObj[address].isBold)
        {
            dataObj[address].isBold = true;
            lastCellSelected.style.fontWeight = "bold";
        }
        else
        {
            dataObj[address].isBold = false;
            lastCellSelected.style.fontWeight = "";
        }
    }
})

italic.addEventListener("click", function(){
    if(lastCellSelected)
    {
        let address = lastCellSelected.getAttribute("data-address");
        
        if(!dataObj[address].isItalic)
        {
            dataObj[address].isItalic = true;
            lastCellSelected.style.fontStyle = "italic";
        }
        else
        {
            dataObj[address].isItalic = false;
            lastCellSelected.style.fontStyle = "";
        }
    }
})

underline.addEventListener("click", function(){
    if(lastCellSelected)
    {
        let address = lastCellSelected.getAttribute("data-address");
        if(!dataObj[address].isUnderline)
        {
            dataObj[address].isUnderline = true;
            lastCellSelected.style.textDecoration = "underline";
        }
        else
        {
            dataObj[address].isUnderline = false;
            lastCellSelected.style.textDecoration = "";
        }
    }
})

fileBtn.addEventListener("click", function(){
    
    let isOpen = fileBtn.getAttribute("data-open");
    
    if(isOpen == "true")
    {
        let dropdown = document.querySelector(".dropdown");
        fileBtn.setAttribute("data-open", "false");
        dropdown.remove();
    }
    else
    {
        fileBtn.setAttribute("data-open", "true");
        let dropdownMenu = document.createElement("div");
        dropdownMenu.innerHTML = "<p>Save</p><p>Clear</p>"
        dropdownMenu.classList.add("dropdown")
        body.append(dropdownMenu);
        
        let saveBtn = document.querySelectorAll(".dropdown p")[0];
        saveBtn.addEventListener("click", function(){
            let sheetName = document.querySelector(".title").innerText;
            localStorage.setItem(`${sheetName}`, JSON.stringify(dataObj));
            fileBtn.setAttribute("data-open", "false");
            dropdownMenu.remove();
        })

        let clearBtn = document.querySelectorAll(".dropdown p")[1];
        clearBtn.addEventListener("click", function(){
            let sheetName = document.querySelector(".title").innerText;
            localStorage.removeItem(`${sheetName}`);
            fileBtn.setAttribute("data-open", "false");
            dropdownMenu.remove();
        })
    }
})

bgColor.addEventListener("click", function(){

    let colorPicker = document.createElement("input");
    colorPicker.type = "color";
    body.append(colorPicker);
    colorPicker.click();

    colorPicker.addEventListener("input", function(e){
        if(lastCellSelected)
        {
            let address = lastCellSelected.getAttribute("data-address");
            dataObj[address].bgColor = e.currentTarget.value;
            lastCellSelected.style.backgroundColor = e.currentTarget.value;
        }
    })
})

textColor.addEventListener("click", function(){

    let colorPicker = document.createElement("input");
    colorPicker.type = "color";
    body.append(colorPicker);
    colorPicker.click();

    colorPicker.addEventListener("input", function(e){
        if(lastCellSelected)
        {
            let address = lastCellSelected.getAttribute("data-address");
            dataObj[address].color = e.currentTarget.value;
            lastCellSelected.style.color = e.currentTarget.value;
        }
    })
})

fontFamilyBtn.addEventListener("change", function(e){
    if(lastCellSelected)
    {
        let address = lastCellSelected.getAttribute("data-address");
        dataObj[address].fontFamily = e.currentTarget.value;
        lastCellSelected.style.fontFamily = e.currentTarget.value;
    }
})

fontSizeBtn.addEventListener("change", function(e){
    if(lastCellSelected)
    {
        let address = lastCellSelected.getAttribute("data-address");
        dataObj[address].fontSize = e.currentTarget.value;
        lastCellSelected.style.fontSize = `${Number(e.currentTarget.value)}px`;
    }
})
