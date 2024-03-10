const inputSlider=document.querySelector("[data-lengthSlider]");
const lengthDisplay=document.querySelector("[data-lengthNumber]");
const passwordDisplay=document.querySelector("[data-passwordDisplay]");
const copyBtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copyMsg]");
const uppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#lowercase");
const numbersCheck=document.querySelector("#numbers");
const symbolsCheck=document.querySelector("#symbols");
const indicator=document.querySelector("[data-indicator]");
const generateBtn=document.querySelector(".generateButton");
const allCheckBox=document.querySelectorAll("input[type=checkbox");
const symbols='~!@#$%^&*?`(){}[]\|/+-;:<><';


//initially
let password="";
let passwordLength=10;
let checkCount=0;
handleSlider();

//ste strength circle color to grey
setIndicator("#ccc");

// set passwordLength 
function handleSlider(){
    //handleSlider ....password ko UI par reflect karwata hai
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;
    //or kya karna chahiye??..H.W
    const min =inputSlider.min;
    const max =inputSlider.max;
    inputSlider.style.backgroundSize=((passwordLength-min)*100/(max-min))+"% 100%"
}

function setIndicator(color){
    //input color set karta hai ....setIndicator(color)
    indicator.style.backgroundColor=color;
    //shadow...................H.W
    indicator.style.boxShadow=`0px 0px 12px 1px ${color}`;

}

function getRndInteger(min,max){
    return Math.floor(Math.random()*(max-min))+min;
    // Math.random().....give value/number between 0-1 
    // ho sakta hai decemal value aa jaye .....Math.random()*(max-min)
    // too floor use kiya hai  ......Math.floor()

    // 0->max-min
    // 0+min->max-min+min 
    // min->max 

}
/*
function getRndInteger(min,max){
    return Math.floor(Math.random()*(max-min))+min
}*/

function generateRandomNumber(){
    return getRndInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,90));
}

function generateSymbol(){
    const randNum=getRndInteger(0,symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength(){
    // ye check karta hai kaun sa checkbox tick hai kaun sa nhi 
    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSym=false;
    if(uppercaseCheck.checked)hasUpper=true;
    if(lowercaseCheck.checked)hasLower=true;
    if(numbersCheck.checked)hasNum=true;
    if(symbolsCheck.checked)hasSym=true;
    //conditions hai
    if(hasUpper&& hasLower &&(hasNum||hasSym)&&passwordLength>=8){
        setIndicator("#0f0");
    }
    else if(
        (hasLower||hasUpper)&&
        (hasNum||hasSym)&&
        passwordLength>=6
    ){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}

async function copyContent(){
    // clipboard ka content copy karta hai 
// await tabhi kaam karta hai jab async function ke ander likhte hai
    try{
        await navigation.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="Failed";
    }
    catch(e){
        copyMsg.innerText="copied";
    }

    //to make copy wala span visible
    copyMsg.classList.add("active");


    setTimeout(() => {
        copyMsg.classList.remove("active");
    },2000);

}




//shuffle password
function shufflePassword(array){
    //Fisher yates Method
    for(let i=array.length-1;i>0;i--){
        //random j ,find out using random function
        const j=Math.floor(Math.random()*(i+1));
        //swap number at i index and j index 
        const temp=array[i];
        array[i]=array[j];
        array[j]=temp;
    }
    let str="";
    array.forEach((el)=>(str+=el));
    return str;
}





//checkbox 
function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked)
        checkCount++;
    });
    // specific condition 
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
}

// checkbox 
allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxChange);
})

// slider 
inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleSlider();
})

// copy button 
copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value)
    copyContent();
})

//  generate password  
generateBtn.addEventListener('click',()=>{
//  none of the checkbox is selected 
if(checkCount==0)
   return;

if(passwordLength<checkCount){
    passwordLength=checkCount;
    handleSlider();
}

//lets start the journey to find the new password

//remove old password
password="";

//lets put the stuff mentioned by the checkboxes


/*
if(uppercaseChecked.ckecked){
    password+=generateUppercase();
}

if(lowercaseChecked.ckecked){
    password+=generateLowercase();
}

if(numbersChecked.ckecked){
    password+=generateRandomNumber();
}

if(symbolsChecked.ckecked){
    password+=generateSymbol();
}
*/

// another way 
let funcArr=[];
if(uppercaseCheck.checked)
    funcArr.push(generateUpperCase);

if(lowercaseCheck.checked)
    funcArr.push(generateLowerCase);

if(numbersCheck.checked)
    funcArr.push(generateRandomNumber);

if(symbolsCheck.checked)
    funcArr.push(generateSymbol );



 //compulsary addition

for(let i=0;i<funcArr.length;i++){
    password+=funcArr[i]();
}

    //remaining addition
for(let i=0;i<passwordLength-funcArr.length;i++){
    let randIndex=getRndInteger(0,funcArr.length);
    password+=funcArr[randIndex]();
}
//shuffle the password to make stronger
password=shufflePassword(Array.from(password));

//show the UI
passwordDisplay.value=password;

//calculate strength
calcStrength();


});

