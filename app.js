var express = require('express')
var app = express();

var bodyParser = require('body-parser');

app.set('view engine', 'jade');

app.use(express.static('public')); //тут усі статичні файли, як-то: favicon, javascripts, style.css etc




app.use(bodyParser.urlencoded({'extended': 'true'})); //без цього не хотіло читати дані POST :) Очевидно!
app.use(bodyParser.json());

var fs= require('fs');
//------------------------------------------------------
var
	H= 10,
	W= 10;

/*/
var O= [ //objects
	['0','1','2','3','4','5','6','7','8','9'],
	['1','G','G','G','G','G','G','*','G','G'],
	['2','G','G','G','G','G','G','*','*','G'],
	['3',' ',' ',' ',' ',' ',' ',' ','G',' '],
	['4',' ',' ',' ',' ',' ',' ',' ',' ',' '],
	['5',' ',' ',' ',' ',' ',' ',' ',' ',' '],
	['6',' ',' ',' ',' ',' ',' ',' ',' ',' '],
	['7',' ',' ',' ',' ',' ',' ',' ',' ',' '],
	['8',' ',' ',' ',' ',' ',' ',' ',' ',' '],
	['9',' ',' ',' ',' ',' ',' ',' ',' ',' ']
];

var _str_= JSON.stringify(O);
fs.writeFileSync('test.txt', _str_);
//*/
var O= [];


//O= JSON.parse(fs.readFileSync('test.txt'));console.log(O);

var S= JSON.parse(fs.readFileSync('S.txt')); //string to JSON
console.log(S);


var I= JSON.parse(fs.readFileSync('I.txt'));
console.log(I);
//------------------------------------------------------




app.get('/', function (req, res) { //start

	/*
	var tab= '<table id="tab" border=1 cellspacing=0  >';
	for (var i=0;i<H;i++) {
		tab+= '<tr>';
		for (var j=0;j<W;j++) {
			tab+= '<td id="'+(H-1-i)+'-'+j+'" class="area-cell" ></td>';//  '+A[H-1-i][j]+'
		}
		tab+= '</tr>';
	}
	tab+= '</table>';
	*/
	res.render('index.jade', { H: H, W: W});
});



app.post('/api/action', function(req,res) { //move etc
	console.log(req.body);
	S=  JSON.parse(fs.readFileSync('S.txt'));

	var //!
		passHorizontal= ' -=',
		passUp= ' |H',
		noRepulsion= ' |';


	if (req.body.act==='move right') {
		if ( passHorizontal.indexOf(O[S.y][S.x+1])>-1 ) {
			S.x++;
		}
	}
	if (req.body.act==='move left') {
		if ( passHorizontal.indexOf(O[S.y][S.x-1])>-1 ) {
			S.x--;
		}
	}
	if (req.body.act==='jump') {
		if ( passUp.indexOf(O[S.y+1][S.x])>-1 && noRepulsion.indexOf(O[S.y-1][S.x])===-1 ) {
			S.y++;
		}
	}

	//var I= JSON.parse(fs.readFileSync('I.txt'));



	fs.writeFileSync('S.txt', JSON.stringify(S));

	res.send( "moved to: " );//+JSON.stringify(req.body)


});


app.post('/api/manipulate', function(req,res) { //switch, crush, put etc
	console.log(req.body);
	O= JSON.parse(fs.readFileSync('O.txt'));

	S= JSON.parse(fs.readFileSync('S.txt'));

	I= JSON.parse(fs.readFileSync('I.txt'));

	var
		i= req.body.cell.i,
		j= req.body.cell.j,
		n= I[0];

	// O[i][j] I[n]


	if ( I[n]===" " ) {
		if ( O[i][j]==="-" ) {
			O[i][j]= "|";
		} else if ( O[i][j]==="|" ) {
			O[i][j]= "-";
		}

		switch (O[i][j]) {
			case "G": case "*":
				I[n]= O[i][j];
				O[i][j]= " ";
				//console.log(I, i, j);
				break;
		}



	} else if ( O[i][j]===" " ) {
		switch (I[n]) {
			case "G": case "|": case "=":
				O[i][j]= I[n];
				I[n]= " ";
				break;
		}



	} else if ( i===S.y && j===S.x ) {
		if ( I[n]==="*" ) {
			I[n]= " ";
			//bellyful is increasing...


		}

	}



	//console.log(O);

	fs.writeFileSync('O.txt', JSON.stringify(O));
	fs.writeFileSync('I.txt', JSON.stringify(I));

	res.send( "manipulate: " );//+JSON.stringify(req.body)


});



app.post('/api/choose', function(req,res) { //choose tool/inventory
	console.log(req.body);
	//var I= JSON.parse(fs.readFileSync('I.txt'));
	I[0]= req.body.n;


	fs.writeFileSync('I.txt', JSON.stringify(I));

	res.send( "choosen: " );//+JSON.stringify(req.body)


});


//------------------------------------------------------------------------------
app.get('/api/refresh', function(req,res) { //refresh situation
	//console.log('the new refresh. x='+S.x+', y='+S.y);

	S= JSON.parse(fs.readFileSync('S.txt'));

	O= JSON.parse(fs.readFileSync('O.txt'));

	//...objects changes

	I= JSON.parse(fs.readFileSync('I.txt'));





	var allowAction= ' -|=H'; //!

	var actionMask= '['+(S.y)+'|'+(S.x-1)+']'
		+'['+(S.y)+'|'+(S.x+1)+']'
		+'['+(S.y+1)+'|'+(S.x)+']'
		+'['+(S.y-1)+'|'+(S.x)+']';
	if ( allowAction.indexOf(O[S.y][S.x-1])>-1 || allowAction.indexOf(O[S.y-1][S.x])>-1 )
		actionMask+= '['+(S.y-1)+'|'+(S.x-1)+']';
	if ( allowAction.indexOf(O[S.y][S.x+1])>-1 || allowAction.indexOf(O[S.y-1][S.x])>-1 )
		actionMask+= '['+(S.y-1)+'|'+(S.x+1)+']';
	if ( allowAction.indexOf(O[S.y][S.x-1])>-1 || allowAction.indexOf(O[S.y+1][S.x])>-1 )
		actionMask+= '['+(S.y+1)+'|'+(S.x-1)+']';
	if ( allowAction.indexOf(O[S.y][S.x+1])>-1 || allowAction.indexOf(O[S.y+1][S.x])>-1 )
		actionMask+= '['+(S.y+1)+'|'+(S.x+1)+']';




	res.json({ H: H, W: W, O: O, S: S, I: I, actionMask: actionMask });


	var doNotSupport= ' |'; //!

	if (doNotSupport.indexOf(O[S.y-1][S.x])>-1) { //falling
		S.y--;
		fs.writeFileSync('S.txt', JSON.stringify(S));
	}









});
//------------------------------------------------------------------------------
var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('App listening at http://%s:%s', host, port);

});
