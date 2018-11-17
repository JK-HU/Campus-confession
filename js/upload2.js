// 发布页
var releaseBBG = document.getElementsByClassName("releaseBBG")[0];
var releaseBBG_label = releaseBBG.getElementsByTagName("label")[0];
var laber_input = document.getElementById("file");

var upulImg = document.getElementsByClassName("upulImg")[0];
var popup_release = document.getElementsByClassName("popup-release")[0];
var relase_button = popup_release.getElementsByClassName("button")[1];
var upDataContent = document.getElementsByClassName("upDataContent")[0].getElementsByTagName("input")[0];

  var conval = '';
  var listImg = []; // 存放图片 用于id
  var dataArr = [];  //存放图片 用于提交
  var imgMsg = {};
  var base64Url;
  
  relase_button.addEventListener("click",function() {
    upLoadimg();
  });
  releaseBBG_label.addEventListener('change',function(e) {
    addImg(e);
    //console.log(getImageUrl(laber_input.files[0]))
  },false);


function upLoadimg() {
  var releaseVal = upDataContent.value; // 发布内容 
  
  var formData = new FormData();
  
  formData.append("img",laber_input.files[0]);
  formData.append("topicContent",releaseVal);
  formData.append("topicDate", "2018-09-18 11:16:38");
  formData.append("topicId", "1014");
  console.log(laber_input.files[0])
console.log(releaseVal)
  
  var url = "http://www.lkweb.top:8080/topic";
  
  var request = new Request(url, {
      method: 'POST',
      credentials: 'include',
      body: formData,
  });

  fetch(request)
      .then(response => {
        if (response) {
          $(upDataContent).val('');  //上传成功,清空input
          $(upulImg).empty();  //上传成功,清空图片
          return response.json()
        }else {
          throw new Error('error!');
        }
      })
      .then(result => {
        $(upDataContent).val('');  //上传成功,清空input
        $(upulImg).empty();  //上传成功,清空图片
        console.log(result)
      })
      .catch(err => {
        console.log(err)
      })
}



function addImg(e) {
  //var formDta = new FormData();
  var fileNumMax = 6;  //上传图片的个数
  var file = e.target.files || e.dataTransfer.files;  //fileList
  
  if (!file || !window.FileReader) return;
  if (/^image/.test(file[0].type)) {
    for ( var i = 0 , len = file.length; i < len ; i++ ) {
      (function(f) {
        var filereade = new FileReader();
        filereade.onload = function(evt) {
          const files = e.srcElement.files[0]
          console.log(files)
          var imgURL = window.URL.createObjectURL(files) // imgURL就是你的图片的本地路径，两部就能解决问题
          base64Url = imgURL;  // 此处base64url不在是base64,改为blob 图片本地地址,
          var fileName = f.name; //文件名
          imgMsg = {
          // content : conval,
            name : fileName,
            base64url : base64Url
          };

          let fileStreamSize = calculaFileSize(base64Url);
          let compressAfterImgUrl = "";
          let compressAfterImgSize = "";
          let newImg = createNewImg(base64Url);
           if ( fileStreamSize >= 5242880 ) {  // 限制图片大小
            try { //图片过大可能压缩失败，抛出异常
              compressAfterImgUrl = compressImg(img);
              compressAfterImgSize = calculaFileSize(compressAfterImgUrl);
              return
            }catch (error) {
              compressAfterImgSize = base64Url;
              alert("上传的图片过大，无法压缩，使用原图");
            }
           }
            // 限制上传个数
          if ( len > fileNumMax ){
            $.alert(`你上传了${len}张,最多上传6张`,function() {
              return ;
            })
            return;
          }


          var li = document.createElement("li");
          var img = document.createElement("img");
          var span_det_img = document.createElement("span");
          li.className = 'col-33 upli';
          span_det_img.className = 'icon icon-remove deletImg';
          img.src = imgURL;
          
          listImg.push(img);
          console.log(listImg);
          
          imgId(listImg);
          
          li.appendChild(img);
          li.appendChild(span_det_img);
          deleteImgIcon(span_det_img,listImg);
          
          upulImg.appendChild(li);
          upulImg.style.display = 'block';
        }
        filereade.readAsDataURL(f);
        //console.log(filereade)
      })(e.target.files[i]);
    }

  }else{
    alert(`文件${file.name}不是图片`);
  }
  
}







// 添加图片ID
function imgId(listimg) {
  var ids = '';
  return ids = listimg.map(function(imgval,index) {
    return listimg[index].index = index;
  });
}

// 删除图片

function deleteImgIcon(icon,listimg) {
  var retuimg_id = imgId(listimg);
   for ( let i = 0 ,len = retuimg_id.length ; i < len ; i++ ) {
    icon.i = i;
    icon.addEventListener('touchend',function(ev) {
      var span_parent = this.parentNode;  //li
      span_parent.classList.remove("col-33");
      span_parent.classList.remove("upli");
      span_parent.parentNode.removeChild(span_parent);
      console.log(listImg)
      listimg.splice(this.i,1)
      laber_input.value = '';  // 在删除图片函数中将,input的值置空,图片上传后删除,无法再上传的问题
      ev.preventDefault();
    },false);

   }
  
}

// 压缩图片
function compressImg(img) { 
  let self = this;
  const maxSize = 200 * 1024; //200K
  const maxWidth = 640; //设置最大宽度
  const maxHeight = maxWidth; //设置最大高度
  let canvas = document.createElement('canvas');
  let ctx = canvas.getContext('2d');


  if (img.height > maxHeight) {
      //按最大高度等比缩放
      img.width *= maxHeight / img.height;
      img.height = maxHeight;
  }
  if (img.width > maxWidth) {
      //按最大宽度等比缩放
      img.height *= maxWidth / img.width;
      img.width = maxWidth;
  }
  canvas.width = img.width
  canvas.height = img.height

  const fileSize = calculaFileSize(base64Url);
  const compressRate = getCompressRate(maxSize, fileSize);
  const mineType = getBase64Type(base64Url)
  let data = canvas.toDataURL(mineType, 0.2) //data url的形式，压缩为20%
  return data;
}
 
//计算图片大小
function calculaFileSize(base64) { 
  // 计算base64文件流大小
  base64 = base64.substring(22)
  const equalIndex = base64.indexOf('=')
  if (base64.indexOf('=') > 0) {
      base64 = base64.substring(0, equalIndex)
  }
  var strLength = base64.length
  var fileLength = parseInt(strLength - (strLength / 8) * 2)
  return fileLength
}

//创建图像
function createNewImg(base64Url) {
  // 创建一个新图像
  const imgWidth = 640;
  const imgHeight = 640;
  let img = new Image();
  img.src = base64Url;

  if (!img.width || img.width == 0) {
      // 有时图片会压缩失败出现无法获取的情况，也就没有宽和高
      img.width = imgWidth;
      img.height = imgHeight;
  }
  return img;
}
