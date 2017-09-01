var Func = {
	setCookie: function(name,value,time) {
	  	if(!time){
	    	time = 1;
	  	}
	  	let exp = new Date();
	  	exp.setTime(exp.getTime() + time*24*60*60*1000);
	  	document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
	},
	getCookie: function(name) {
	  	let arr, reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
	  	if (arr=document.cookie.match(reg)) {
	    	return unescape(arr[2]);
	  	} else {
	    	return null;
	  	}
	},
	delCookie: function(name) {
	  	let exp = new Date();
	  	exp.setTime(exp.getTime() - 1);
	  	let cval = this.getCookie(name);
	  	if (cval) {
	  		document.cookie= name + "=" + cval + ";expires=" + exp.toGMTString();
	  	}
	},
	setStorage: function(name,value) {
	  window.localStorage.setItem(name,value);
	},
	getStorage: function(name) {
	  return window.localStorage.getItem(name);
	},
	delStorage: function(name) {
	  this.setStorage(name,'');
	},
	toast: function(str) {
		if (document.querySelector('.toast')) {
			return;
		}
		let body = document.querySelector('body');
		let div = document.createElement('div');
		div.className = 'toast';
		div.innerHTML = str;
		body.appendChild(div);
		setTimeout(function () {
	    	div.style.opacity = 1;
	    	setTimeout(function(){
	      		div.style.opacity = 0;
	      		setTimeout(function(){
		      		div.parentNode.removeChild(div);
		    	},350);
	    	},2000);
	  	}, 300);
	},
	formatTime: function(time) {
		let date = new Date(time);
		let now = new Date();
  		let Y, M, D, h, m, s;
  		let _Y, _M, _D, _h, _m, _s;
  		Y = date.getFullYear();
  		M = date.getMonth();
  		D = date.getDate();
  		h = date.getHours();
  		m = date.getMinutes();
  		s = date.getSeconds();

  		_Y = now.getFullYear();
  		_M = now.getMonth();
  		_D = now.getDate();
  		_h = now.getHours();
  		_m = now.getMinutes();
  		_s = now.getSeconds();

  		if (_Y - Y > 1) {
  			return (_Y - Y) + '年前';
  		}
  		if (_Y - Y > 0) {
  			return '去年'+ M + 1 +'月';
  		}
  		if (_M - M > 0) {
  			return '今年'+ M + 1 +'月';
  		}
  		if (_D - D > 1) {
  			return (_D - D) +'天前';
  		}
  		if (_D - D > 0) {
  			return '昨天' + h + '点';
  		}
  		if (_h - h > 0) {
  			return (_h - h) +'小时前';
  		}
  		if (_m - m > 0) {
  			return (_m - m) +'分钟前';
  		}
  		if (_s - s > 0) {
  			return (_s - s) +'秒前';
  		}  
  		return '刚刚';
	},
	explorerVersion: function() {
		let explorer = window.navigator.userAgent.toLowerCase();
	 	if (explorer.indexOf("msie") >= 0) {		//ie 
		   	let ver = explorer.match(/msie ([\d.]+)/)[1].slice(0,3);
		   	if (+ver < 10) {
		   		return false;
		   	}
		} else if (explorer.indexOf("firefox") >= 0) {		//firefox 
		   	let ver = explorer.match(/firefox\/([\d.]+)/)[1].slice(0,3);
		   	if (+ver < 18) {
		   		return false;
		   	}
		} else if(explorer.indexOf("chrome") >= 0){		//Chrome
			let ver = explorer.match(/chrome\/([\d.]+)/)[1].slice(0,3);
		   	if (+ver < 21) {
		   		return false;
		   	}
		} else if(explorer.indexOf("opera") >= 0){		//Opera
			let ver = explorer.match(/opera.([\d.]+)/)[1].slice(0,3);
			if (+ver < 17) {
		   		return false;
		   	}
		} else if(explorer.indexOf("Safari") >= 0){		//Safari
			let ver = explorer.match(/version\/([\d.]+)/)[1].slice(0,3);
			if (+ver < 6.1) {
		   		return false;
		   	}
		}
		return true;
	},
	parseLyric: function(lrc) {
    	let lyrics = lrc.split("\n");
    	let lrcObj = {};
	    for(let i = 0; i < lyrics.length;i ++){
	        let lyric = decodeURIComponent(lyrics[i]);
	        let timeReg = /\[\d*:\d*((\.|\:)\d*)*\]/g;
	        let timeRegExpArr = lyric.match(timeReg);
	        if(!timeRegExpArr)continue;
	        let clause = lyric.replace(timeReg,'');
	        for(let k = 0,h = timeRegExpArr.length;k < h;k ++) {
	            let t = timeRegExpArr[k];
	            let min = Number(String(t.match(/\[\d*/i)).slice(1)),
	                sec = Number(String(t.match(/\:\d*/i)).slice(1));
	            let time = min * 60 + sec;
	            lrcObj[time] = clause;
	        }
	    }
	    return lrcObj;
	},
	randomArr: function(arr) {
	 	let len = arr.length;
	 	for(let i = 0; i < len - 1; i++){
	 		let idx = Math.floor(Math.random() * (len - i));
	 		let temp = arr[idx];
	 		arr[idx] = arr[len - i - 1];
	 		arr[len - i -1] = temp;
	 	}
	 	return arr;
	}
}

export default Func