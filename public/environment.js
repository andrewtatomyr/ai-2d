


function moveAJAX(what) {

	$.ajax({
	  type: "POST",
	  data: { "act": what.act },
	  url: '/api/action',
	  dataType: 'JSON'
	}).done(function(res) {
	  console.log(res.msg);//?
	});
}

function actionHandler(event) {

	var listenKey= document.body.className;//--
	/*/--
	//document.body.off("keyup", actionHandler(event));//--
	$(document.body).removeClass("activeToListenKey");//--
	console.log(listenKey);//
	setTimeout(function() { //--затримка
		$(document.body).addClass("activeToListenKey");//--
	}, 250/1); //--
	//--*/


	if (listenKey==='activeToListenKey') {
		switch (event.keyCode) {
			case 100: case 68: moveAJAX({ "act": "move right" }); /*console.log("move right");*/ break;
			case 97: case 65: moveAJAX({ "act": "move left" }); /*console.log("move left");*/ break;
			case 119: case 87: moveAJAX({ "act": "move up" }); /*console.log("move up");*/ break;

			case 32: moveAJAX({ "act": "jump" }); /*console.log("jump");*/ break;

		}
	}




}

function manipulateAJAX(what) {

	$.ajax({
	  type: "POST",
	  data: what,
	  url: '/api/manipulate',
	  dataType: 'JSON'
	}).done(function(res) {
	  console.log(res.msg);//?
	});
}

function manipulate(cell, tag) {

	//console.log(cell.i+'|'+cell.j);


	if (tag.className==="active") {
		/*switch (expression) {
			case expression:

				break;
			default:

		}*/
		//var toolNo= $("td.choosen").attr("id");

		//toolNo= toolNo.substring(3);
		//console.log(toolNo);
		manipulateAJAX({  "cell": cell });
	}
}

function chooseAJAX(n) {

	$.ajax({
	  type: "POST",
	  data: { "n": n },
	  url: '/api/choose',
	  dataType: 'JSON'
	}).done(function(res) {
	  console.log(res.msg);//?
	});
}

function choose(n) {
	chooseAJAX(n);
}



//------------------------------------------------------------------------------
(function() {

	//console.log('page was loaded');





	/*/
	$("td").click(function(){
		alert(1);
		//alert($(this).text()); // Бла-Бла-Бла
	});
	/*
	$('td').onclick = function(event) {
    // вывести тип события, элемент и координаты клика
    alert(event.type + " на " + event.currentTarget);
    alert(event.clientX + ":" + event.clientY);
  }
	//*/
	//console.log($("#tab"));
	//$("#tab").onclick= function() { alert(1)}




	setInterval(function() {
		$.getJSON('/api/refresh', function(data) {
			//populate
			var H= data.H, W= data.W;
			var O= data.O;
			var y= data.S.y, x= data.S.x;
			var I= data.I;
			var actionMask= data.actionMask;
			//console.log(actionMask);

			for (var i=0;i<H;i++) {
				for (var j=0;j<W;j++) {
					var cell= $('#c'+i+'-'+j);
					cell.text(O[i][j]).removeClass("active");
					if ( actionMask.indexOf( '['+i+'|'+j+']' ) > -1 ) {
						cell.text(cell.text()+'.');
						//event вішати треба тільки ОДИН РАЗ!!!
						cell.addClass( "active" );

						//cell.click( manipulate );
						/*
						cell.click( (function(element) {
					    return function() {
				        manipulate(element);
					    }
						})({i:i,j:j}) );
						*/
						//cell.click( (function() { manipulate('['+i+'|'+j+']'); }) );
					}
				}
			}

			//and at last put the @:
			$('#c'+y+'-'+x).text('@');

			//inventory:? why do'nt working??????
			for (var n=1; n<=9; n++) {
				$("#inv"+n).text(I[n]);
			}
			var choosenInv= $("#inv"+I[0]);
			//console.log("#inv"+I[0]);
			choosenInv.text("["+choosenInv.text()+"]").addClass("choosen");





			//console.log(y+'|'+x);
		});

	}, 250);

	//console.log($("td"));



})();
