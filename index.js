// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

// the link to your model provided by Teachable Machine export panel
const URL = "./my_model/";
const input = document.querySelector("#input");
const undo = document.querySelector("#undo");
const reset = document.querySelector("#reset");
const scoreContainer = document.querySelector("#score-container");
input.style.display = "none";

const Goukakyu = "巳未申亥午寅";
const Housenka = "子寅戌丑卯寅";
const Kuchiyose = "亥戌酉申未";
const Bunshin = "未巳寅";

let model, webcam, labelContainer, maxPredictions;
let state,previousInput,currentInput,start;
state="";
start=false;

// Load the image model and setup the webcam
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // or files from your local hard drive
    // Note: the pose library adds "tmImage" object to your window (window.tmImage)
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Convenience function to setup a webcam
    const flip = true; // whether to flip the webcam
    webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();
    window.requestAnimationFrame(loop);

    // append elements to the DOM
    document.getElementById("webcam-container").appendChild(webcam.canvas);
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) { // and class labels
        labelContainer.appendChild(document.createElement("div"));
    }
    input.style.display = "block";
}

async function loop() {
    webcam.update(); // update the webcam frame
    await predict();
    window.requestAnimationFrame(loop)
}

// run the webcam image through the image model
async function predict() {
    // predict can take in an image, video or canvas html element
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
        // const classPrediction =
        //     prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        // if((prediction[i].className !== "初期状態") && (prediction[i].className !== "default")) labelContainer.childNodes[i].innerHTML = classPrediction;
        if(prediction[i].probability > 0.999){
            currentInput = prediction[i].className;
        }
    }
    if(!start && (currentInput === "初期状態")){
        start=true;
        document.getElementById("sign").style.display = "none";
        previousInput=currentInput;
    }
    if(start){
        if((previousInput !== currentInput) && (currentInput !== "初期状態") && (currentInput !== "default")){
            previousInput = currentInput;
            state+=currentInput;
            scoreContainer.innerHTML+=currentInput + " ";
        }
        checkPtn();
    }
}

function checkPtn() {
    if(state === Goukakyu){
        let audio = new Audio("./audio/Goukakyu.wav");
        audio.play();
        res();
    }else if(state === Housenka){
        let audio = new Audio("./audio/Housenka.wav");
        audio.play();
        res();
    }else if(state === Kuchiyose){
        let audio = new Audio("./audio/Kuchiyose.wav");
        audio.play();
        res();
    }else if(state === Bunshin){
        let audio = new Audio("./audio/Bunshin.wav");
        audio.play();
        res();
    }
}

undo.addEventListener("click",() =>{
    previousInput = state.slice((state.length-2),(state.length-1));
    currentInput = previousInput;
    if(!(state === "")) scoreContainer.innerHTML = scoreContainer.innerHTML.slice(0,-2);
    state = state.slice(0,-1);
});

reset.addEventListener("click",() =>{
    res();
});

function res() {
    document.getElementById("sign").style.display = "block";
    previousInput = "";
    state = "";
    scoreContainer.innerHTML="現在の入力 : ";
    start=false;
}