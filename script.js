let ham = document.getElementById("ham");
let nav = document.getElementsByClassName("nav")[0]
let navlist_second = document.getElementsByClassName("nav-list-second")[0]

ham.addEventListener('click',()=>{
    nav.classList.toggle("active-nav")
    navlist_second.classList.toggle("active-nav-list-second")
    if(nav.classList.contains("active-nav")){
        ham.src="cross.svg"
    }else{
        ham.src = "hamburgur.svg"
    }
})
var typed = new Typed('#profession', {
    strings: ['Web Developer','Software Developer','React Developer'],
    typeSpeed: 150,
    backSpeed: 150,
    loop:true
  });

let htmlprog = document.getElementsByClassName("html-prog")[0]
let cssprog = document.getElementsByClassName("css-prog")[0]
let jsprog = document.getElementsByClassName("js-prog")[0]
let htmlvalue = document.getElementsByClassName("html-value")[0]
let cssvalue = document.getElementsByClassName("css-value")[0]
let jsvalue = document.getElementsByClassName("js-value")[0]
let h =0;
let c=0;
let j=0;
let html = setInterval(()=>{
    h++;
    htmlvalue.innerHTML = `${h}%`
    htmlprog.style.background = `conic-gradient(rgb(35, 201, 121) ${3.6*h}deg, rgb(8, 10, 11) 0deg)`
    if(h==90){
        clearInterval(html);
    }
})
let css = setInterval(()=>{
    c++;
    cssvalue.innerHTML = `${c}%`
    cssprog.style.background = `conic-gradient(rgb(35, 201, 121) ${3.6*c}deg, rgb(8, 10, 11) 0deg)`
    if(c==80){
        clearInterval(css);
    }
})
let js = setInterval(()=>{
    j++;
    jsvalue.innerHTML = `${j}%`
    jsprog.style.background = `conic-gradient(rgb(35, 201, 121) ${3.6*j}deg, rgb(8, 10, 11) 0deg)`
    if(j==75){
        clearInterval(js);
    }
})
let reactprog = document.getElementsByClassName("inner-react-prog")[0]
let cppprog = document.getElementsByClassName("inner-cpp-prog")[0]
let pythonprog = document.getElementsByClassName("inner-python-prog")[0]
let dsaprog = document.getElementsByClassName("inner-dsa-prog")[0]
let reactvalue = document.getElementsByClassName("react-value")[0]
let cppvalue = document.getElementsByClassName("cpp-value")[0]
let pythonvalue = document.getElementsByClassName("python-value")[0]
let dsavalue = document.getElementsByClassName("dsa-value")[0]
let r=0;
let cp =0;
let p =0;
let d=0;
let react = setInterval(()=>{
    r++;
    reactvalue.innerHTML = `${r}%`
    reactprog.style.width = `${(60*(1/100))*r}vw`
    if(r==80){
        clearInterval(react);
    }
})
let cpp = setInterval(()=>{
    cp++;
    cppvalue.innerHTML = `${cp}%`
    cppprog.style.width = `${(60*(1/100))*cp}vw`
    if(cp==90){
        clearInterval(cpp);
    }
})
let python = setInterval(()=>{
    p++;
    pythonvalue.innerHTML = `${p}%`
    pythonprog.style.width = `${(60*(1/100))*p}vw`
    if(p==80){
        clearInterval(python);
    }
})
let dsa = setInterval(()=>{
    d++;
    dsavalue.innerHTML = `${d}%`
    dsaprog.style.width = `${(60*(1/100))*d}vw`
    if(d==70){
        clearInterval(dsa);
    }
})

let tl =gsap.timeline();
tl.from(".nav",{
    x:-200,
    opacity:0,
    duration:0.5
})
tl.from(".left-nav",{
    y:-100,
    opacity:0,
    duration:0.5
})
tl.from(".list-items",{
    y:-30,
    opacity:0,
    duration:0.1,
    stagger:1
})
let tl2 = gsap.timeline()
tl2.from(".line",{
    x:-80,
    opacity:0,
    duration:0.5,
    stagger:1
})
tl2.from("#btn1",{
    x:-80,
    opacity:0,
    duration:0.5,
    stagger:1
})
gsap.from("#logo",{
    x:80,
    opacity:0,
    duration:0.5
})
let tl3 = gsap.timeline()
tl3.from(".heading",{
    x:-200,
    opacity:0,
    duration:0.5,
    scrollTrigger:{
        trigger:".heading",
        scroller:"body",
        start:"top 80%",
        end:"top 60%",
        scrub:2
    }
})
tl3.from(".about-details",{
    y:200,
    opacity:0,
    duration:0.5,
    scrollTrigger:{
        trigger:".about-details",
        scroller:"body",
        start:"top 80%",
        end:"top 60%",
        scrub:2
    }
})
tl3.from(".box",{
    x:200,
    opacity:0,
    duration:0.5,
    stagger:1,
    scrollTrigger:{
        trigger:".box",
        scroller:"body",
        start:"top 70%",
        end:"top 70%",
        scrub:2
    }
})
let tl4 = gsap.timeline();
tl4.from(".heading-skill",{
    x:-200,
    opacity:0,
    duration:0.5,
    scrollTrigger:{
        trigger:".heading-skill",
        scroller:"body",
        start:"top 80%",
        end:"top 60%",
        scrub:2
    }
})
tl4.from(".prog",{
    x:200,
    opacity:0,
    rotate:360,
    duration:0.2,
    stagger:1,
    scrollTrigger:{
        trigger:".prog",
        scroller:"body",
        start:"top 80%",
        end:"top 60%",
        scrub:2
    }
})
tl4.from(".linear-prog",{
    x:-200,
    opacity:0,
    duration:0.1,
    stagger:1,
    scrollTrigger:{
        trigger:".linear-prog",
        scroller:"body",
        start:"top 80%",
        end:"top 60%",
        scrub:2
    }
})
tl4.from(".skill-content",{
    x:-200,
    opacity:0,
    duration:0.1,
    stagger:1,
    scrollTrigger:{
        trigger:".skill-content",
        scroller:"body",
        start:"top 70%",
        end:"top 70%",
        scrub:2
    }
})
let tl5 = gsap.timeline();
tl5.from(".right-contact",{
    x:400,
    duration:0.5,
    scrollTrigger:{
        trigger:".right-contact",
        scroller:"body",
        start:"top 80%",
        end:"top 60%",
        scrub:2
    }
})
tl5.from(".left-contact",{
    x:-500,
    duration:0.5,
    stagger:1,
    scrollTrigger:{
        trigger:".left-contact",
        scroller:"body",
        start:"top 80%",
        end:"top 60%",
        scrub:2
    }
})