Skip to content
Why GitHub? 
Enterprise
Explore 
Marketplace
Pricing 
Search

Sign in
Sign up
000pawelniesiolowski/memory_game
 Code Issues 0 Pull requests 0 Projects 0 Security Insights
Join GitHub today
GitHub is home to over 40 million developers working together to host and review code, manage projects, and build software together.

memory_game/memory.js
@pawelniesiolowski pawelniesiolowski About me
f4fee8f on Jan 27, 2018
210 lines (180 sloc)  4.45 KB
  
$(function()
{
	var allCards = [];
	var oneVisible = false;
	var turnCounter = 0;
	var $firstCard = null;
	var firstNumber = undefined;
	var lock = false;
	var pairsLeft = 18;

	$('#start').on('click', startGame);
	$('#scores').on('click', loadRecords);
	$('#credits').on('click', function() { window.location.href = "credits.html"; } );
	$('#return').on('click', function() { window.location.href = "index.php"; } );
    $('#portfolio').on('click', function() { window.location.href = "../" } );



	function startGame()
	{
		turnCounter = 0;
		drawBoard();
		prepareCards();
		catchBoard();
		$('#record').html('');
		pairsLeft = 18;
	}

	function drawBoard()
	{
		var startHTML = '';
		for(i = 0; i < 36; i++)
		{
			startHTML += '<div class="card" id="t'+i+'"></div>';
		}

		startHTML+='<div class="score">Turn counter: 0</div>';
		startHTML+='<button class="button" id="return2">Return</button>';
		$('#board').html(startHTML);
		$('#return2').on('click', function(){ window.location.reload(); } );
	}

	function prepareCards()
	{
		var cards = [];
		for(var i = 0, j = 0; i < 18; i++, j=j+2)
		{
			var name = 't'+i+'.jpg';
			cards[j] = name;
			cards[j+1] = name;

		}

		var maxIndex = 35;

		for(var k = 0; k<cards.length; k++)
		{
			var index = Math.floor(Math.random() * maxIndex);
			allCards[k] = cards[index];

			cards[index] = cards[maxIndex];
			maxIndex--;
		}
	}

	function catchBoard()
	{
		$('#board').on('click', function(e) { revealCard(e); } );
	}

	function revealCard(e)
	{
		if(!$(e.target).hasClass('card'))
		{
			return;
		}

		if(lock)
		{
			return;
		}
		lock = true;
		$el = $(e.target);
		var opacityValue = $el.css('opacity');
		var nr = e.target.id.substring(1);
		var picture = 'url(img/' + allCards[nr] + ')';
		$el.css('background-image', picture);
		$el.addClass('cardA');
		$el.removeClass('card');

		if(oneVisible == false)
		{
			oneVisible = true;
			$firstCard = $el;
			firstNumber = nr;
			lock = false;
		}
		else
		{
			check2cards(firstNumber, nr, $firstCard, $el);
		}
	}

	function check2cards(nr1, nr2, $card1, $card2)
	{
		if(nr1 == nr2)
		{
			lock = false;
			return;
		}
		else if(allCards[nr1] == allCards[nr2] )
		{
			setTimeout(function() { hideCards($card1, $card2) }, 750);
		}
		else
		{
			setTimeout(function() { restoreCards($card1, $card2) }, 1000);
		}
		turnCounter++;
		$('.score').html('Turn counter: ' + turnCounter);
		oneVisible = false;
	}

	function hideCards($card1, $card2)
	{
		$card1.css('opacity', '0');
		$card1.off('click');
		$card2.css('opacity', '0');
		$card2.off('click');

		pairsLeft--;

		if(pairsLeft == 0)
		{
			win();
		}

		lock = false;
	}

	function restoreCards($card1, $card2)
	{
		$card1.css('background-image', 'url(img/card.jpg)');
		$card1.addClass('card');
		$card1.removeClass('cardA');

		$card2.css('background-image', 'url(img/card.jpg)');
		$card2.addClass('card');
		$card2.removeClass('cardA');
		lock = false;
	}

	function win()
	{
		var text = '<h1>You win!<br>Done in ' + turnCounter + ' turns.</h1><img src="img/win.jpg" alt="Agent Cooper" class="cooper2">';
		var restartHTML = '<button class="button" id="restart">Restart</button>';
		$('#board').html(text);
		$('#record').html(restartHTML);
		$('#restart').on('click', startGame);

		checkRecords();
	}

	function checkRecords()
	{
		$.ajax(
		{
			type: 'POST',
			url: 'records_data.json',
			success: function(data)
			{
				for(var i = 0; i < data.length; i++)
				{
					if(turnCounter < data[i].score)
					{
						msg = '<form style="margin: 10%" id="newRec" action="record.php" method="post"><h1>Rekord!!!</h1><label for="name">Type your name:</label><br><input type="text" id="name" name="name" required maxlength="10"><br><label for="turn">Your score:</label><br><input type="number" name="turn" value="' + turnCounter + '" readonly>turns<br><input class="button" type="submit" value="Save"></form>';
						$('#record').html(msg);
					}
				}
			}
		});

	}

	function loadRecords()
	{
		$.ajax(
		{
			type: 'GET',
			url: 'records_data.json',
			success: function(data)
			{

				var list1 = '';
				var list2 = '';
				for(var i = 0; i < data.length; i++)
				{
					list1 += '<li>' + data[i].name + '</li>';
					list2 += '<li>' + data[i].score + ' turns</li>';
				}
				var msg = '<h1>Best scores</h1><div class="lists"><ol>'+list1+'</ol><ul>'+list2+'</ul></div><button class="button" id="return3">Return</button>';
				$('.note').html('');
				$('#board').html(msg);
				$('#return3').on('click', function(){ window.location.reload(); } );
			}
		});
	}

});
© 2019 GitHub, Inc.
Terms
Privacy
Security
Status
Help
Contact GitHub
Pricing
API
Training
Blog
About
