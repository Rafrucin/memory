var ruler = 40;
drawboard(ruler);
var cards = [];
var flag = 0;
var oneVis = false;
var turncount = 0;
var visnr;
var lock=false;
var pairsleft = ruler/2;
fill(ruler/2);

function drawboard(z)
{
	var divek = "";
	var k = z;
	for ( i = 0; i<k;i++)
	{
		divek += '<div class="card" id="c'+i+'"></div>';		
	}
	divek+='<div class="score">Turn counter: 0</div>';
	$('#board2').html(divek);
}

function los (a)
{
	min = Math.ceil(1);
	max = Math.floor(a);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}



function fill (z)
{
	var wylos = los(z);
	var a= cards.length;
	for (i=0; i<=a; i++)
	{
		if (cards[i]==wylos) {flag++;}
	}
	if (flag<2) 
	{
		cards.push(wylos);
		flag=0;
	}
	flag = 0;
	if (cards.length<(2*z)) fill(z);
	
}
$('#board2').on('click', function(e) { reveal(e); } );



function reveal(n)
{
	$nu = $(n.target);
	var nr = n.target.id.substring(1);
	var opval = $nu.css('opacity');

	if (opval!=0 && lock==false && nr!=visnr && $(n.target).hasClass('card'))
	{
		lock=true;
		new Audio('snd/card.wav').play(); 
		var obraz = "url(img/"+cards[nr]+".png)";
		$nu.css('background-image', obraz);
		$nu.addClass('cardA');
		$nu.removeClass('card');
		if (oneVis==false)
		{
			//first cards
			oneVis=true;
			visnr=nr;
			lock=false;
			
		}	
		else
		{
			//second card

			if(cards[nr]==cards[visnr])
			{
				new Audio('snd/yes.wav').play();
				setTimeout(function(){hide2cards (nr,visnr)}, 750);				
			}else{
				//$('#no')[0].play(); 
				setTimeout(function(){reset2cards (nr,visnr)}, 1000);					
			}
			
			turncount++;
			$('.score').html('Turn counter: '+turncount);
			oneVis=false;
		}
	}
}

function hide2cards (a,b)
{
	$('#c'+a).css('opacity', '0');
	$('#c'+b).css('opacity', '0');
	lock=false;
	pairsleft--;
	visnr=100;
	if (pairsleft==0)
	{
		$('#ap')[0].play(); 
		$('.board').html('<h1>You win! <br> Done in '+turncount+' turns</h1> <br> <form><input type="submit" value="Play again?"></form>');
	}
	
}

function reset2cards (nr,nr2)
{
		var obraz = "url(img/karta.png";
		$('#c'+nr).css('background-image', obraz);
		$('#c'+nr).addClass('card');
		$('#c'+nr).removeClass('cardA');
		
		$('#c'+nr2).css('background-image', obraz);
		$('#c'+nr2).addClass('card');
		$('#c'+nr2).removeClass('cardA');
		visnr=100;
		lock=false;
}
















