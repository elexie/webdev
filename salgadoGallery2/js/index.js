var isOpenedModal=false;
var nums=["one", "two", "three", "four", "five", "six",
          "seven", "eight", "nine","ten","eleven",
          "twelve","thirteen", "fourteen", "fifteen"];

var pat = new RegExp("images.*(?:jpg|png|jpeg)");//patern to find in regex
var leftImg,midImg,rightImg;

var left=0, middle=1, right=2;
var copyClassName;
function closeWindow(){
  var exitButton=$("#exitButton");
  $("#exitButton").onmouseOver(function(){

  });
}//end of closeWindow

/**
@imgUrl url of image to clean
ex: ("http://127.0.0.1:8080/images/childWelfare.jpg")

@return the url stripped of all characters(parentheses, quotes)
except its full, relative path
ex: images/childWelfare.jpg
*/
function cleanUrl(imgUrl){
  return pat.exec(imgUrl);
}
/**
adds the "url(../)" wrapper to the
left, mid, and right images
*/
function setUrl(path){
return "url(\'../"
              +path
              +"\')";
}
/**
@className spelling of the class name
(ex: "one", "two","three")

@return the url of the previous image.
*/
function getPrevUrl(className){
  var imgUrl="";
  if(className=="one"){//reset the gallery to the end
    imgUrl=$(".fifteen").css("background-image");
    // console.log(imgUrl); ex imgUrl: ("http://127.0.0.1:8080/images/childWelfare.jpg")
  }

  else{
    var newClassName=nums[nums.indexOf(className)-1];
    imgUrl=$("."+newClassName).css('background-image');
    // console.log(imgUrl); ex imgUrl: ("http://127.0.0.1:8080/images/childWelfare.jpg")
    //console.log(newClassName) ex newClassName: one, two, five, twelve, fifteen
  }
  return cleanUrl(imgUrl);
}
/**
@className spelling of the class name
(ex: "one", "two","three")
*/
function getNextUrl(className){

  if(className=="fifteen"){//restart the gallery to the front
    imgUrl=$(".one").css("background-image");
  }
  else{
    var newClassName=nums[nums.indexOf(className)+1];
    imgUrl=$("."+newClassName).css('background-image');
  }
  return cleanUrl(imgUrl);
}
var nextNextUrl, prevPrevUrl;
function setPrevPrevUrl(nextNextUrl){
nextNextUrl=this.nextNextUrl;
}
function setNextNextUrl(prevPrevUrl){
prevPrevUrl=this.prevPrevUrl;
}

/**
loads 3 images into the modal at a time.
left: previous image.. modalImg1
middle: clicked image.. modalImg2
right: next image..     modalImg3
*/
function showImageModal(){

  var className,
  prevUrl, midUrl, nextUrl;

  updateImgPosition();//initial definition of leftImg, midImg, rightImg

  $('.imageBox').dblclick(function(){

    if(!isOpenedModal){//if the modal is not already opened
      $('#bodyOverlay').css('visibility','visible'); //dim the rest of website

      midUrl=$(this).css('background-image');//store the full url of clicked image
      className=$(this).attr('class').split(' ')[1];//returns the second name of the class: one, two, three,etc
                                                    //in imageBox one, imageBox two, imageBox three etc

      copyClassName=className;
       //define urls of images to place into the three divs
       prevUrl=setUrl(cleanUrl(getPrevUrl(className)));
       midUrl=setUrl(cleanUrl(midUrl));
       nextUrl=setUrl(cleanUrl(getNextUrl(className)));

      // console.log(prevUrl); console.log(midUrl);  console.log(nextUrl);

      //add images to divs as background images
      $('#modalImg1').css('background-image',prevUrl);
      $('#modalImg2').css('background-image',midUrl);
      $('#modalImg3').css('background-image',nextUrl);

      //place description of images from json
      //file in description div
      getDescription(className);

      //bring the modal into view
      $('#modal').slideDown('slow');

      isOpenedModal=true;
    }
  });

}//end of showImageModal

//returns a digit when given the spelling of a number
function getNumericVal(spelling){
          return nums.indexOf(spelling);
}
/**
@className name of class: ex .one, .two, .three
*/
function getDescription(className){
   var xhttp=new XMLHttpRequest(); //create an http object
   var arr,returnVal, title, location,date,desc;

   xhttp.onreadystatechange= function(){
         if(xhttp.readyState==4 && this.status==200){//connection was successful
           arr=JSON.parse(xhttp.responseText).descriptions;//stores the description array from the imgDesc file as a js object
           title="<h3 style=\"padding-top: 2em; font-family:Century Gothic;font-weight:normal;letter-spacing:.1em;\">"+arr[getNumericVal(className)]['title']+"</h3>";
           location="<span style=\"font-family:Arial;\">"+"<p>"+arr[getNumericVal(className)]['location']+"</span><br>";
           date=arr[getNumericVal(className)]['date']+"</p>";
           desc="<p style=\"padding-bottom: 1em; line-height:1.7em;\">"+arr[getNumericVal(className)]['desc']+"<p>";
           // console.log(xhttp.responseText);
           $("#modalDesc").html(title+location+date+desc);
         }//end of if(xhttp.readyState...
   }//end of xhttp.onreadystatechange
   xhttp.open("GET", "../json/imgDesc.json", true);
   xhttp.send();

}//end of getDescription

function updateNext(){
var temp=middle;
middle=right;
right=temp;
}
function updatePrev(){
var temp=middle;
middle=left;
left=temp;
}
var midImgBg;
function updateImgPosition(){
  leftImg=$("#modalImages div").eq(left);
  midImg=$("#modalImages div").eq(middle);
  rightImg=$("#modalImages div").eq(right);
  midImgBg=midImg.css("background-image");
}
function slideLeftDiv(){
leftImg.animate({"left":"-=100px"},"fast");
}
function slideRightDiv(){
rightImg.animate({"left":"+=100px"},"fast");
}
function slideMidDiv(direction){
  if(direction=="next"){
    // console.log("neext");
    midImg.animate({"left":"-=100px"},"fast");
  }if(direction=="prev"){
    // console.log("preev");
    midImg.animate({"left":"+=100px"},"fast");
  }
  alert(midImg.css('background-image'));

}

function slideImage(){
  var prev=$("#prevIcon"), next=$("#nextIcon");

  next.click(function(){
  updateNext();
  // console.log(left+" "+middle+" "+ right);
  updateImgPosition();
  slideRightDiv();
  slideMiddleDiv("next");
  updateMidImgBgNext();
  updateLeftDivBg();//
  });
  prev.click(function(){
    updatePrev();
    // console.log(left+" "+middle+" "+ right)
    updateImgPosition();
    slideLeftDiv();
    slideMidDiv("prev");
    updateMidImgBgPrev();
    updateRightDivBg();//
  });
}
function updateMidImgBgPrev(){
leftImg.css("background-image",getPrevUrl(copyClassName);
}

function updateMidImgBgNext(){
leftImg.css("background-image",getNextUrl(copyClassName);
}

function updateRightDivBg(){
rightImg.css("background-image",midImgBg);
}
function updateLeftDivBg(){
leftImg.css("background-image",midImgBg);
}

$(document).ready(function(){
showImageModal();
slideImage();
});
