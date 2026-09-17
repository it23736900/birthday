const passwordGate=document.getElementById("passwordGate");
const passwordInput=document.getElementById("passwordInput");
const passwordBtn=document.getElementById("passwordBtn");
const passwordMessage=document.getElementById("passwordMessage");
const lockCircle=document.getElementById("lockCircle");
const lockIcon=document.getElementById("lockIcon");
const experience=document.getElementById("experience");
const scenes=[...document.querySelectorAll(".scene")];
const progressBar=document.getElementById("progressBar");
const progressText=document.getElementById("progressText");
const nextIndicator=document.getElementById("nextIndicator");
const backButton=document.getElementById("backButton");
const musicButton=document.getElementById("musicButton");
const music=document.getElementById("birthdayMusic");

let currentScene=0;
let changingScene=false;
let experienceStarted=false;
let musicPlaying=false;

function normalizePassword(value){
    return value.toLowerCase().trim().replace(/\s+/g,"").replace(/-/g,"/");
}

function passwordIsCorrect(value){
    const clean=normalizePassword(value);
    const validAnswers=["november17","nov17","11/17","17/11","11/17/2025","17/11/2025"];
    return validAnswers.includes(clean);
}

function tryPassword(){
    const value=passwordInput.value;

    if(passwordIsCorrect(value)){
        passwordMessage.style.color="#bff1cb";
        passwordMessage.textContent="That's the one ❤️";
        lockIcon.textContent="🔓";
        lockCircle.classList.add("correct");
        confettiBurst(35);

        setTimeout(()=>passwordGate.classList.add("unlocked"),280);

        setTimeout(()=>{
            passwordGate.style.display="none";
            experience.classList.remove("hidden");
            experience.classList.add("interface-enter");
            createStars();
            updateProgress();

            setTimeout(()=>{
                experience.classList.remove("interface-enter");
            },950);
        },820);
    }else{
        passwordMessage.style.color="#ff96aa";
        passwordMessage.textContent="Hmm... try that special date again ♡";

        passwordInput.animate(
            [
                {transform:"translateX(0)"},
                {transform:"translateX(-7px)"},
                {transform:"translateX(7px)"},
                {transform:"translateX(-5px)"},
                {transform:"translateX(5px)"},
                {transform:"translateX(0)"}
            ],
            {duration:380}
        );
    }
}

passwordBtn.addEventListener("click",tryPassword);
passwordInput.addEventListener("keydown",(event)=>{
    if(event.key==="Enter") tryPassword();
});

document.getElementById("openExperience").addEventListener("click",async()=>{
    experienceStarted=true;

    try{
        music.volume=0.28;
        await music.play();
        musicPlaying=true;
    }catch(error){
        console.log("Music could not autoplay.");
    }

    confettiBurst(55);
    setTimeout(()=>goToScene(1,"down"),180);
});

function goToScene(newIndex,direction="down"){
    if(changingScene) return;
    if(newIndex<0||newIndex>=scenes.length||newIndex===currentScene) return;
    if(currentScene===0&&!experienceStarted&&newIndex>0) return;

    changingScene=true;

    const oldScene=scenes[currentScene];
    const newScene=scenes[newIndex];

    if(direction==="down"){
        oldScene.classList.add("exit-up");
    }else{
        newScene.classList.add("from-top");
    }

    oldScene.classList.remove("active");
    newScene.offsetHeight;
    newScene.classList.add("active");
    newScene.classList.remove("from-top");

    currentScene=newIndex;
    updateProgress();
    animateSceneContents(newScene);

    setTimeout(()=>{
        oldScene.classList.remove("exit-up");
        changingScene=false;
    },1080);

    if(newIndex===1){
        setTimeout(()=>confettiBurst(42),350);
    }
}

function animateSceneContents(scene){
    const elements=scene.querySelectorAll("h1, h2, .eyebrow, .description, .polaroid, .flip-card, .gift-box");

    elements.forEach((element,index)=>{
        element.animate(
            [
                {opacity:0,transform:"translateY(20px)"},
                {opacity:1,transform:"translateY(0)"}
            ],
            {
                duration:720,
                delay:index*70,
                easing:"cubic-bezier(.16,.8,.25,1)",
                fill:"both"
            }
        );
    });
}

function updateProgress(){
    const percent=((currentScene+1)/scenes.length)*100;
    progressBar.style.width=`${percent}%`;
    progressText.textContent=`${currentScene+1} / ${scenes.length}`;
    backButton.style.opacity=currentScene===0?".25":"1";

    if(currentScene===scenes.length-1){
        nextIndicator.style.display="none";
    }else{
        nextIndicator.style.display="flex";
    }
}

let wheelCooldown=false;

window.addEventListener("wheel",(event)=>{
    if(passwordGate.style.display!=="none") return;
    if(wheelCooldown) return;
    if(Math.abs(event.deltaY)<42) return;

    wheelCooldown=true;

    if(event.deltaY>0){
        goToScene(currentScene+1,"down");
    }else{
        goToScene(currentScene-1,"up");
    }

    setTimeout(()=>wheelCooldown=false,1250);
},{passive:true});

let touchStartY=0;
let touchEndY=0;

window.addEventListener("touchstart",(event)=>{
    touchStartY=event.changedTouches[0].screenY;
},{passive:true});

window.addEventListener("touchend",(event)=>{
    touchEndY=event.changedTouches[0].screenY;
    handleSwipe();
},{passive:true});

function handleSwipe(){
    const difference=touchStartY-touchEndY;
    if(Math.abs(difference)<65) return;

    if(difference>0){
        goToScene(currentScene+1,"down");
    }else{
        goToScene(currentScene-1,"up");
    }
}

window.addEventListener("keydown",(event)=>{
    if(passwordGate.style.display!=="none") return;

    if(event.key==="ArrowDown"||event.key==="PageDown"){
        goToScene(currentScene+1,"down");
    }

    if(event.key==="ArrowUp"||event.key==="PageUp"){
        goToScene(currentScene-1,"up");
    }
});

nextIndicator.addEventListener("click",()=>{
    if(currentScene===0&&!experienceStarted) return;
    goToScene(currentScene+1,"down");
});

backButton.addEventListener("click",()=>{
    goToScene(currentScene-1,"up");
});

musicButton.addEventListener("click",async()=>{
    if(musicPlaying){
        music.pause();
        musicPlaying=false;
        musicButton.textContent="♪";
    }else{
        try{
            await music.play();
            musicPlaying=true;
            musicButton.textContent="♫";
        }catch(error){}
    }
});

document.querySelectorAll(".flip-card").forEach(card=>{
    card.addEventListener("click",()=>card.classList.toggle("flipped"));
});

const scratchCanvas=document.getElementById("scratchCanvas");
const scratchCard=document.getElementById("scratchCard");
const scratchContext=scratchCanvas.getContext("2d");
const scratchProgress=document.getElementById("scratchProgress");
const scratchPercent=document.getElementById("scratchPercent");

let scratching=false;
let scratchFinished=false;
let scratchCounter=0;

function setupScratchCanvas(){
    const rect=scratchCard.getBoundingClientRect();
    const ratio=window.devicePixelRatio||1;

    scratchCanvas.width=rect.width*ratio;
    scratchCanvas.height=rect.height*ratio;

    scratchContext.setTransform(ratio,0,0,ratio,0,0);

    const gradient=scratchContext.createLinearGradient(0,0,rect.width,rect.height);

    gradient.addColorStop(0,"#b58aa8");
    gradient.addColorStop(.22,"#e9cbd9");
    gradient.addColorStop(.48,"#c7a3ba");
    gradient.addColorStop(.72,"#f2dce5");
    gradient.addColorStop(1,"#aa809f");

    scratchContext.globalCompositeOperation="source-over";
    scratchContext.fillStyle=gradient;
    scratchContext.fillRect(0,0,rect.width,rect.height);

    scratchContext.strokeStyle="rgba(255,255,255,.10)";
    scratchContext.lineWidth=1;

    for(let x=-300;x<rect.width+300;x+=25){
        scratchContext.beginPath();
        scratchContext.moveTo(x,0);
        scratchContext.lineTo(x+300,rect.height);
        scratchContext.stroke();
    }

    scratchContext.fillStyle="#604a59";
    scratchContext.textAlign="center";
    scratchContext.font="700 11px DM Sans";
    scratchContext.fillText("A SECRET IS HIDING HERE",rect.width/2,rect.height/2-20);

    scratchContext.font="700 25px Playfair Display";
    scratchContext.fillText("Scratch to reveal ✨",rect.width/2,rect.height/2+17);

    scratchContext.font="12px DM Sans";
    scratchContext.fillStyle="#745e6e";
    scratchContext.fillText("Use your finger or mouse",rect.width/2,rect.height/2+45);
}

function scratch(clientX,clientY){
    const rect=scratchCanvas.getBoundingClientRect();
    const x=clientX-rect.left;
    const y=clientY-rect.top;

    scratchContext.globalCompositeOperation="destination-out";

    const brush=scratchContext.createRadialGradient(x,y,5,x,y,30);

    brush.addColorStop(0,"rgba(0,0,0,1)");
    brush.addColorStop(.7,"rgba(0,0,0,.9)");
    brush.addColorStop(1,"rgba(0,0,0,0)");

    scratchContext.fillStyle=brush;
    scratchContext.beginPath();
    scratchContext.arc(x,y,31,0,Math.PI*2);
    scratchContext.fill();

    scratchCounter++;

    if(scratchCounter%7===0) calculateScratchAmount();
}

function calculateScratchAmount(){
    if(scratchFinished) return;

    const imageData=scratchContext.getImageData(0,0,scratchCanvas.width,scratchCanvas.height);
    const data=imageData.data;

    let transparent=0;
    let samples=0;

    for(let i=3;i<data.length;i+=4*45){
        samples++;
        if(data[i]<60) transparent++;
    }

    const percentage=Math.min(100,Math.round(transparent/samples*100));

    scratchProgress.style.width=`${percentage}%`;
    scratchPercent.textContent=`${percentage}% revealed`;

    if(percentage>=52){
        scratchFinished=true;
        scratchCanvas.style.opacity="0";
        scratchProgress.style.width="100%";
        scratchPercent.textContent="Surprise unlocked ♡";
        confettiBurst(50);

        setTimeout(()=>{
            scratchCanvas.style.pointerEvents="none";
        },700);
    }
}

scratchCanvas.addEventListener("pointerdown",event=>{
    scratching=true;
    scratchCanvas.setPointerCapture(event.pointerId);
    scratch(event.clientX,event.clientY);
});

scratchCanvas.addEventListener("pointermove",event=>{
    if(!scratching) return;
    scratch(event.clientX,event.clientY);
});

scratchCanvas.addEventListener("pointerup",()=>{
    scratching=false;
    calculateScratchAmount();
});

scratchCanvas.addEventListener("pointercancel",()=>{
    scratching=false;
});

const giftBoxes=[...document.querySelectorAll(".gift-box")];
const giftResult=document.getElementById("giftResult");

const giftMessages=[
    {title:"Unlimited hugs unlocked 🤗",text:"Valid whenever you need one. No expiry date."},
    {title:"A secret birthday wish 💌",text:"May something you have quietly been hoping for finally come true this year."},
    {title:"One extra reason to smile ✨",text:"Today's rule: enjoy the day without overthinking anything."}
];

let giftChosen=false;

giftBoxes.forEach((box,index)=>{
    box.addEventListener("click",()=>{
        if(giftChosen) return;
        giftChosen=true;

        box.classList.add("opened");

        giftBoxes.forEach((otherBox,otherIndex)=>{
            if(otherIndex!==index) otherBox.classList.add("disabled");
        });

        setTimeout(()=>{
            giftResult.innerHTML=`
                <h3>${giftMessages[index].title}</h3>
                <p>${giftMessages[index].text}</p>
            `;

            giftResult.animate(
                [
                    {opacity:0,transform:"translateY(15px)"},
                    {opacity:1,transform:"translateY(0)"}
                ],
                {duration:500,fill:"both"}
            );

            confettiBurst(40);
        },450);
    });
});

const wheel=document.getElementById("birthdayWheel");
const spinButton=document.getElementById("spinButton");
const spinResult=document.getElementById("spinResult");

const prizes=[
    "🤗 Unlimited Hug",
    "🎂 Cake Treat",
    "💌 Secret Message",
    "🎁 Bonus Surprise",
    "✨ Make a Wish",
    "❤️ Unlimited Birthday Wishes"
];

let wheelHasSpun=false;
let currentRotation=0;

spinButton.addEventListener("click",()=>{
    if(wheelHasSpun) return;

    wheelHasSpun=true;
    spinButton.disabled=true;
    spinResult.textContent="Spinning... ✨";
    wheel.classList.add("spinning");

    const prizeIndex=Math.floor(Math.random()*prizes.length);
    const fullRotations=6*360;
    const sector=60;
    const target=360-(prizeIndex*sector+sector/2);
    const randomOffset=Math.random()*24-12;

    currentRotation+=fullRotations+target+randomOffset;
    wheel.style.transform=`rotate(${currentRotation}deg)`;

    const tickInterval=setInterval(()=>{
        spinResult.animate(
            [{opacity:.55},{opacity:1}],
            {duration:110}
        );
    },180);

    setTimeout(()=>{
        clearInterval(tickInterval);
        wheel.classList.remove("spinning");

        spinResult.textContent=`You got: ${prizes[prizeIndex]}`;

        spinResult.animate(
            [
                {transform:"scale(.9)",opacity:0},
                {transform:"scale(1.08)",opacity:1},
                {transform:"scale(1)"}
            ],
            {duration:550,fill:"both"}
        );

        confettiBurst(65);
    },4900);
});

const envelope=document.getElementById("envelope");
const openLetter=document.getElementById("openLetter");

openLetter.addEventListener("click",()=>{
    envelope.classList.add("open");
    openLetter.style.opacity="0";
    openLetter.style.pointerEvents="none";

    setTimeout(()=>{
        openLetter.style.display="none";
    },400);
},{once:true});

const finalButton=document.getElementById("finalButton");
const finalReveal=document.getElementById("finalReveal");
const finalQuestion=document.getElementById("finalQuestion");

finalButton.addEventListener("click",()=>{
    finalButton.style.display="none";
    finalQuestion.style.display="none";
    finalReveal.classList.add("show");
    confettiBurst(180);
},{once:true});

function confettiBurst(amount=50){
    const layer=document.getElementById("confettiLayer");
    const items=["✨","💖","🎉","🌸","⭐","❤️","♡"];

    for(let i=0;i<amount;i++){
        const piece=document.createElement("span");
        piece.className="confetti";
        piece.textContent=items[Math.floor(Math.random()*items.length)];
        piece.style.left=`${Math.random()*100}vw`;
        piece.style.fontSize=`${11+Math.random()*18}px`;
        piece.style.animationDuration=`${2.5+Math.random()*3}s`;
        piece.style.animationDelay=`${Math.random()*.5}s`;
        layer.appendChild(piece);

        setTimeout(()=>piece.remove(),6500);
    }
}

function createStars(){
    const holder=document.getElementById("stars");

    if(holder.children.length>0) return;

    for(let i=0;i<55;i++){
        const star=document.createElement("span");
        star.className="star";
        star.style.left=`${Math.random()*100}%`;
        star.style.top=`${Math.random()*100}%`;
        star.style.animationDelay=`${Math.random()*4}s`;
        star.style.animationDuration=`${2+Math.random()*4}s`;
        holder.appendChild(star);
    }
}

window.addEventListener("resize",()=>{
    if(!scratchFinished) setupScratchCanvas();
});

setTimeout(setupScratchCanvas,250);
updateProgress();
