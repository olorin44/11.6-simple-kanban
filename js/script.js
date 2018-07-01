'use strict'; 
(function(){

	var idTable = [];

	var inputCheck = function (inputChars) {
		return (inputChars && inputChars.trim().length);
	};

	var wrongInput = function() {
		alert('The name field was empty!');
	};

	document.addEventListener('DOMContentLoaded', function() {
	    function randomString() {
	    var chars = '0123456789abcdefghiklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXTZ';
	    var str = '';
	    for (var i = 0; i < 10; i++) {
	        str += chars[Math.floor(Math.random() * chars.length)];
	    }

	    if (idTable.includes(str)) {
	    	randomString();

	    } else {
	    	idTable.push(str);
	    	return str;
	    }
	}

	function generateTemplate(name, data, basicElement) {
		var template = document.getElementById(name).innerHTML;
		var element = document.createElement(basicElement || 'div');

		Mustache.parse(template);
		element.innerHTML = Mustache.render(template, data);

		return element;
	}

	function Column(name) {
		var self = this;

		this.id = randomString();
		var columnId = this.id;
		this.name = name;
		this.element = generateTemplate('column-template', { name: this.name, id: this.id });

		this.element.querySelector('.column').addEventListener('click', function (event) {
		  if (event.target.classList.contains('btn-delete')) {
		  	self.removeColumn();
		  }

		  if (event.target.classList.contains('add-card')) {
		  	self.addCard(new Card(columnId, prompt("Enter the name of the card")));
		  }
		});
	}

	Column.prototype = {
	    addCard: function(card) {
	    	this.element.querySelector('ul').appendChild(card.element);
	    },
	    removeColumn: function() {
	    	this.element.parentNode.removeChild(this.element);
	    }
	};

	function Card(description, columnId) {
		var self = this;

		this.id = randomString(columnId);
		this.description = description;
		this.element = generateTemplate('card-template', { description: this.description }, 'li');

		this.element.querySelector('.card').addEventListener('click', function (event) {
			event.stopPropagation();

			if (event.target.classList.contains('btn-delete')) {
				self.removeCard();
			}
/////////////////////////////////////////
			if (event.target.classList.contains('btn-archive')) {
				self.cardArchive();
			}
			////////////////////////////
		});
	}
		
	Card.prototype = {
		removeCard: function() {
			this.element.parentNode.removeChild(this.element);
	    }
	}
	/////////////////////////////////////////////
	Card.prototype = {
		cardArchive: function(card, id) {
			var karta = this.element.parentNode
			var kolumna = karta.parentNode
			var kolumnaArchId = archiveColumn.id
			
			console.log('ID kolumny Archive   ' + kolumnaArchId)
			console.log('karta  ' + karta)
			console.log('archiveColumn  ' + archiveColumn)
			console.log('karta + parent node  ' + karta.parentNode)
			console.log('kolumna  ' + kolumna)
			
		}
	}
	/////////////////////////////////////////////
	var searchColumn = function (column) {
		this.element.appendChild(column.element)

	}
	//////////////////////////////////////////////

	var board = {
	    name: 'Kanban Board',
	    addColumn: function(column) {
	      this.element.appendChild(column.element);
	      initSortable(column.id);
	    },
	    element: document.querySelector('#board .column-container')
	};

	function initSortable(id) {
	  var el = document.getElementById(id);
	  var sortable = Sortable.create(el, {
	    group: 'kanban',
	    sort: true
	  });
	}

	document.querySelector('#board .create-column').addEventListener('click', function() {
	    var name = prompt('Enter a column name');

	    if (inputCheck(name)) {
	    var column = new Column(name);
	    board.addColumn(column);

		} else {
		wrongInput();
		}
	});

	// CREATING COLUMNS
	var todoColumn = new Column('To do');
	var doingColumn = new Column('Doing');
	var doneColumn = new Column('Done');
	var archiveColumn = new Column('Archive');

	// ADDING COLUMNS TO THE BOARD
	board.addColumn(todoColumn);
	board.addColumn(doingColumn);
	board.addColumn(doneColumn);
	board.addColumn(archiveColumn);

	// CREATING CARDS
	var card1 = new Card('New task');
	var card2 = new Card('Create kanban boards');

	// ADDING CARDS TO COLUMNS
	todoColumn.addCard(card1);
	doingColumn.addCard(card2);




});

	})();