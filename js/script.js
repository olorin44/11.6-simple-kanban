'use strict'; 
(function(){

	var idTable = []; // idTable contains all id assigned for cards and columns
	var pairTable = []; //pairTable contains id in order 'column.id:card.id' for cards created in those columns

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
		if (name == 'Archive') {
			self.element.querySelector('.add-card').classList.add('btn-hide');
		}

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
	    	var buttonsRestore = this.element.querySelectorAll('.btn-restore');

	    	for (var btnNumber = 0; btnNumber < buttonsRestore.length; btnNumber++) {
	    		buttonsRestore[btnNumber].classList.add('btn-hide');
	    	};
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

			if (event.target.classList.contains('add-text')) {
				var textNote = prompt('Please enter your text');
				if (inputCheck(textNote)) {
					self.element.querySelector('.card-content').innerHTML = textNote;
					} else wrongInput();
			}

		});

		this.element.querySelector('.card').addEventListener('drop', function (event) {
			self.moveCard();
		});
	}
		
	Card.prototype = {
		removeCard: function() {
			this.element.parentNode.removeChild(this.element);
	    },

		archiveCard: function() {
			document.getElementById(archiveColumn.id).appendChild(this.element);
			this.element.querySelector('.btn-archive').classList.add('btn-hide');
			this.element.querySelector('.btn-restore').classList.remove('btn-hide');
		},

		restoreCard: function(card) {
			var self = this;
			var cardId = this.element.querySelector('.card').id;

			for (var idCount = 0; idCount < pairTable.length; idCount++) {
				if (pairTable[idCount].includes(cardId)) {
					var primaryColumn = pairTable[idCount-1]
				}
			}
			
			document.getElementById(primaryColumn).appendChild(this.element);
			this.element.querySelector('.btn-restore').classList.add('btn-hide');
			this.element.querySelector('.btn-archive').classList.remove('btn-hide');
		},

		moveCard: function() {
			if (this.element.parentNode.id == archiveColumn.id) {
				this.element.querySelector('.btn-archive').classList.add('btn-hide');
				this.element.querySelector('.btn-restore').classList.remove('btn-hide');

			} else {
				this.element.querySelector('.btn-restore').classList.add('btn-hide');
				this.element.querySelector('.btn-archive').classList.remove('btn-hide');
			}
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