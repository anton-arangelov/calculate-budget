// BUDGET CONTEROLLER

var budgetCotroller = (function () {

  class Expense {
    constructor(id, description, value) {
      this.id = id;
      this.description = description;
      this.value = value;
      this.percentage = -1;
    }

    getPercentage = function () {
      return this.percentage;

    }

    calcPercentage = function (totalIncome) {
      if (totalIncome > 0) {
        this.percentage = Math.round((this.value / totalIncome) * 100);
      } else {
        this.percentage = -1;
      }
    }


  };

  // Expense.prototype.calcPercentage = function (totalIncome) {
  //   if (totalIncome > 0) {
  //     this.percentage = Math.round((this.value / totalIncome) * 100);
  //   } else {
  //     this.percentage = -1;
  //   }
  // };

  // Expense.prototype.getPercentage = function () {
  //   return this.percentage;
  // };

  class Income {
    constructor(id, description, value) {
      this.id = id;
      this.description = description;
      this.value = value;
    }
  };

  var calculateTotal = function (type) {
    var sum = 0;
    data.allItems[type].forEach(cur => {
      sum += cur.value;
    });

    data.totals[type] = sum;
  };

  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: [],
      inc: []
    },
    budget: 0,
    percentage: -1
  }

  return {
    addItem: function (type, des, val) {
      var newItem, ID;

      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      if (type === 'exp') {
        newItem = new Expense(ID, des, val);
      } else if (type === 'inc') {
        newItem = new Income(ID, des, val);
      }

      data.allItems[type].push(newItem);
      return newItem;
    },

    deleteItem: function (type, id) {
      var ids, index;

      ids = data.allItems[type].map(current => {
        return current.id;
      });
      index = ids.indexOf(id);

      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
    },

    calculateBudget: function () {
      calculateTotal('exp');
      calculateTotal('inc');

      data.budget = data.totals.inc - data.totals.exp;

      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },

    calculatePercentage: function () {
      data.allItems.exp.forEach(cur => {
        cur.calcPercentage(data.totals.inc);
      });
    },

    getPercentages: function () {
      var allPerc = data.allItems.exp.map(cur => {
        return cur.getPercentage();
      });
      return allPerc;
    },

    getBudget: function () {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      };
    },

    testing: function () {
      console.log(data);
    }

  };



})();


// UI CONTROLLER

var UIController = (function () {

  var DOMStrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expensesLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    container: '.container',
    expensesPerLabel: '.item__percentage',
    dateLabel: '.budget__title--month'
  };

  var formatNumber = function (num, type) {
    var numSplit, int, int1, int2, dec;

    num = Math.abs(num);
    num = num.toFixed(2);

    numSplit = num.split('.');
    int = numSplit[0];
    int1 = int;
    int2 = int;

    if (int.length > 3) {
      int1 = int.slice(0, 3);
      if (int.length % 3 > 0) {
        int1 = int.substr(0, int.length % 3);
        int2 = '000' + int.slice(int.length % 3);
      }
      for (var i = 3; i < int.length; i += 3) {
        int1 = int1 + ',' + int2.substr(3, 3);
        int2 = int2.slice(3);
      }
    }
    dec = numSplit[1];
    return `${type === 'exp' ? '-' : '+'} ${int1}.${dec}`;
  };

  var nodeListForEach = function (list, callback) {
    for (var i = 0; i < list.length; i++) {
      callback(list[i], i);
    }
  };




  return {

    getInput: function () {
      return {
        type: document.querySelector(DOMStrings.inputType).value,
        description: document.querySelector(DOMStrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
      };
    },

    addListItem: function (obj, type) {
      var html, newHtml, element;

      if (type === 'inc') {
        element = DOMStrings.incomeContainer;
        html = '<div class = "item clearfix" id = "inc-%id%"><div class = "item__description">%description%</div><div class = "right clearfix"><div class = "item__value">%value%</div><div class = "item__delete"><button class = "item__delete--btn"><i class = "ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === 'exp') {
        element = DOMStrings.expensesContainer;
        html = '<div class = "item clearfix" id = "exp-%id%"><div class = "item__description">%description%</div><div class = "right clearfix"><div class = "item__value">%value%</div><div class = "item__percentage">21%</div><div class = "item__delete"><button class = "item__delete--btn"><i class = "ion-ios-close-outline"></i></button></div></div></div>';
      }

      newHtml = html.replace('%id', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

      /*
      <div class = "item clearfix" id = "inc-%id%">
        <div class = "item__description">%description%</div>
        <div class = "right clearfix">
          <div class = "item__value">%value%</div>
          <div class = "item__delete">
            <button class = "item__delete--btn">
              <i class = "ion-ios-close-outline"></i>
            </button>
          </div>
        </div>
      </div>';
      
      */

    },

    deleteListItem: function (selectorID) {
      var el = document.getElementById(selectorID);
      el.parentNode.removeChild(el);
    },

    clearFields: function () {
      // var fields, fieldsArray;

      // fieds = document.querySelectorAll(DOMStrings.inputDescription + ',' + DOMStrings.inputValue);

      // fieldsArray = Array.prototype.slice.call(fields);

      // fieldsArray.forEach((current, index, array) => {
      //   current.value = '';
      // });

      // fieldsArray[0].focus();

      document.querySelector(DOMStrings.inputDescription).value = '';
      //console.log(document.querySelector(DOMstrings.inputDescription).textContent);
      document.querySelector(DOMStrings.inputValue).value = '';
      document.querySelector(DOMStrings.inputDescription).focus();

    },
    displayBudget: function (obj) {
      var type = 'inc';
      obj.budget >= 0 ? type = 'inc' : type = 'exp';

      document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
      document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalInc, type);
      document.querySelector(DOMStrings.expensesLabel).textContent = formatNumber(obj.totalExp, type);


      if (obj.percentage > 0) {
        document.querySelector(DOMStrings.percentageLabel).textContent = `${obj.percentage}%`;
      } else {
        document.querySelector(DOMStrings.percentageLabel).textContent = `---`;
      }

    },


    displayPercentages: function (percentages) {
      var fields = document.querySelectorAll(DOMStrings.expensesPerLabel);

      nodeListForEach(fields, (current, index) => {
        if (percentages[index] > 0) {
          current.textContent = percentages[index] + '%';
        } else {
          current.textContent = '---';
        }
      });
    },

    displayMonth: function () {
      var now, months, month, year;

      now = new Date();
      months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      month = now.getMonth();
      year = now.getFullYear();

      document.querySelector(DOMStrings.dateLabel).textContent = `${months[month]} ${year}`;
    },

    changedType: function () {
      var fields = document.querySelectorAll(DOMStrings.inputType + ', ' + DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);
      nodeListForEach(fields, cur => {
        cur.classList.toggle('red-focus');
      });
      document.querySelector(DOMStrings.inputBtn).classList.toggle('red');
    },

    getDOMStrings: function () {
      return DOMStrings;
    }

  };

})();


// GLOBAL APP CONTROLLER
var Controller = (function (budgetCtrl, UICtrl) {
  var setupEventListeners = function () {
    var DOM = UICtrl.getDOMStrings();

    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
    document.addEventListener('keypress', event => {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });

    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

    document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
  };


  var updateBudget = function () {
    budgetCtrl.calculateBudget();
    var budget = budgetCtrl.getBudget();
    UICtrl.displayBudget(budget);
  };


  var updatePercentages = function () {
    budgetCtrl.calculatePercentage();
    var percentages = budgetCtrl.getPercentages();
    UICtrl.displayPercentages(percentages);
  };

  var ctrlAddItem = function () {
    var input, newItem;

    input = UICtrl.getInput();

    if (input.description !== '' && !isNaN(input.value) && input.value > 0) {

      newItem = budgetCotroller.addItem(input.type, input.description, input.value);

      UICtrl.addListItem(newItem, input.type);

      UICtrl.clearFields();

      updateBudget();

      updatePercentages();
    }
  };


  var ctrlDeleteItem = function (event) {
    var itemID, splitID, type, ID;

    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if (itemID) {
      splitID = itemID.split('-');
      type = splitID[0];
      ID = parseInt(splitID[1]);

      budgetCtrl.deleteItem(type, ID);

      UICtrl.deleteListItem(itemID);

      updateBudget();

      updatePercentages();
    }
  };

  return {
    init: function () {
      UICtrl.displayMonth();
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentages: -1
      });
      setupEventListeners();
    }
  };

})(budgetCotroller, UIController);

Controller.init();




