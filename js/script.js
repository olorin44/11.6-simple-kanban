'use strict'; 
(function(){

	var idTable = [];
	var pairTable = [];

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
	    	return randomString();

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

	function Column(name, column) {
		var self = this;

		this.id = randomString();
		this.name = name;
		this.element = generateTemplate('column-template', { name: this.name, id: this.id });

		this.element.querySelector('.column').addEventListener('click', function (event) {
		  if (event.target.classList.contains('btn-delete')) {
		  	self.removeColumn();
		  }

		  if (event.target.classList.contains('add-card')) {
		  	self.addCard(new Card(prompt("Enter the name of the card")));
		  }
		});
	}

	Column.prototype = {
	    addCard: function(card, primaryColumnId) {
	    	primaryColumnId = this.element.querySelector('ul').id
	    	this.element.querySelector('ul').appendChild(card.element);
	    	pairTable.push(primaryColumnId, card.id);
	    },
	    removeColumn: function() {
	    	this.element.parentNode.removeChild(this.element);
	    }
	};

	function Card(description) {
		var self = this;
		this.id = randomString();
		this.description = description;
		this.element = generateTemplate('card-template', { description: this.description, id: this.id }, 'li');

		this.element.querySelector('.card').addEventListener('click', function (event) {
			event.stopPropagation();

			if (event.target.classList.contains('btn-delete')) {
				self.removeCard();
			}

			if (event.target.classList.contains('btn-archive')) {
				self.archiveCard();
			}

			if (event.target.classList.contains('btn-restore')) {
				self.restoreCard();
			}
		});
	}
		
	Card.prototype = {
		removeCard: function() {
			this.element.parentNode.removeChild(this.element);
	    },

		archiveCard: function() {
			document.getElementById(archiveColumn.id).appendChild(this.element);
		},

		restoreCard: function(card) {
			var self = this;
			var cardId = this.element.querySelector('.card').id;

			for (var i = 0; i < pairTable.length; i++) {
				if (pairTable[i].includes(cardId)) {
					var primaryColumn = pairTable[i-1]
				}
			}

			document.getElementById(primaryColumn).appendChild(this.element);

		}
	};

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