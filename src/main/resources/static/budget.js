
// var total;

// document.querySelector('.budget__value').textContent = '0.00';
// document.querySelector('.budget__income--value').textContent = '0';
// document.querySelector('.budget__expenses--value').textContent = '0';
// document.querySelector('.budget__expenses--percentage').textContent = '0';


// // var description = document.querySelector('.add__description').textContent;
// // console.log(description);



// document.querySelector('.add__description').addEventListener('click',function(){

//     console.log(document.getElementById('add__description'));
//     console.log('hellloooo');

//     var x = document.getElementById('desciption').textContent;
//     console.log(x);

// });



// BUDGET CONTROLLER
var budgetController = (function() {

    var Expense = function(id,description,value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    Expense.prototype.calcPercentage = function(totalIncome) {

        if(totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }


    };

    Expense.prototype.getPercentage = function() {
        return this.percentage;
    };

    var Income = function(id,description,value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function(type) {

        var sum = 0;
        data.allItems[type].forEach(function(curr) {

            sum += curr.value;
        });
        data.totals[type] = sum;

    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget : 0,
        percentage: -1
    }

    return {
        addItem: function(type,des,val) {
            var newItem,ID;

            if(data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }
            else {
                ID = 0;
            }


            if(type === 'exp') {
                newItem = new Expense(ID,des,val);
            }else if(type === 'inc') {
                newItem = new Income(ID,des,val);
            }

            data.allItems[type].push(newItem);
            return newItem;
        },

        deleteItem: function(type,id) {

            var ids,index;
            ids = data.allItems[type].map(function(current){

                return current.id;
            });
            index = ids.indexOf(id);

            if(index !== -1) {
                data.allItems[type].splice(index,1);
            }
        },

        calculateBudget: function() {

            calculateTotal('exp');
            calculateTotal('inc');

            data.budget = data.totals.inc - data.totals.exp;
            if(data.totals.inc > 0){
                data.percentage =Math.round((data.totals.exp / data.totals.inc) * 100);
            }else {
                data.percentage = -1;
            }


        },

        calculatePercentages: function() {

            data.allItems.exp.forEach(function(cur) {
                cur.calcPercentage(data.totals.inc);
            });

        },

        getPercentage : function() {

            var allPerc = data.allItems.exp.map(function(cur) {
                return cur.getPercentage();
            });
            return allPerc;
        },

        getBudget: function() {

            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },

        testing: function() {
            console.log(data);

        }
    };




})();


// UI CONTROLLER
var UIController = (function() {

    var DOMstring = {
        inputType : '.add__type',
        inputDescription : '.add__description',
        inputValue : '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };

    var formatNumber = function(num,type) {

        var numSplit,int,dec;
        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');
        int  = numSplit[0];
        if(int.length > 3) {
           int  = int.substr(0,int.length-3) + ',' + int.substr(int.length-3,int.length);
        }

        dec = numSplit[1];

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
    };

    var nodeListForEach = function(list,callback) {
        for(var i = 0 ; i < list.length ; i++) {
            callback(list[i],i);
        }
    };




    return {
        getInput: function() {

            return {
                type: document.querySelector(DOMstring.inputType).value, // inc or exp
                description: document.querySelector(DOMstring.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstring.inputValue).value)

            };
        },
        addListItem: function(obj,type) {

            var html,newHtml,element;
            if(type === 'inc') {
                element = DOMstring.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            } else if(type === 'exp') {
                element = DOMstring.expenseContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div> <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }

            newHtml = html.replace('%id%',obj.id);
            newHtml = newHtml.replace('%description%',obj.description);
            newHtml = newHtml.replace('%value%',formatNumber(obj.value));

            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
        },

        deleteListItem : function(selectorID) {

            var el = document.getElementById(selectorID)

            el.parentNode.removeChild(el);

        },

        clearFields : function() {
            var fields,fieldsArr;
            fields = document.querySelectorAll(DOMstring.inputDescription + ', ' + DOMstring.inputValue);

            fieldsArr =  Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(current,index,array) {
                current.value = "";
            });
            fieldsArr[0].focus();

        },

        displayBudget: function(obj) {
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';

            document.querySelector(DOMstring.budgetLabel).textContent = formatNumber(obj.budget,type);
            document.querySelector(DOMstring.incomeLabel).textContent = formatNumber(obj.totalInc,'inc');
            document.querySelector(DOMstring.expenseLabel).textContent = formatNumber(obj.totalExp,'exp');


            if(obj.percentage > 0) {
                document.querySelector(DOMstring.percentageLabel).textContent = obj.percentage + '%';
            }else {
                document.querySelector(DOMstring.percentageLabel).textContent = '-----';
            }

        },

        displayPercentages: function(percentages) {

            var fields = document.querySelectorAll(DOMstring.expensesPercLabel);


            nodeListForEach(fields, function(current,index) {

                if(percentages[index] > 0 ) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }


            });

        },

        displayMonth: function() {

            var year,month;
            var now = new Date();
            year = now.getFullYear();
            var months = ['jan','feb','mar','april','may','june','july','aug','sep','oct','nov','dec'];
            month = now.getMonth();

            document.querySelector(DOMstring.dateLabel).textContent = months[month] + ' ' + year;
        },

        changedType: function() {

            var fields = document.querySelectorAll(
                DOMstring.inputType + ',' +
                DOMstring.inputDescription + ',' +
                DOMstring.inputValue);

                nodeListForEach(fields, function(curr) {
                    curr.classList.toggle('red-focus');
                });

                document.querySelector(DOMstring.inputBtn).classList.toggle('red');
        },

        getDOMString : function() {
            return DOMstring;
        }


    };

})();



// CONTROLLER
var controller = (function(budgetCtrl,UICtrl) {


    var setupEventListener = function() {
        var DOM = UICtrl.getDOMString();

        document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);

        document.addEventListener('keypress',function(event) {

            if(event.keyCode === 13) {
                ctrlAddItem();
            }

        });

        document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);

        document.querySelector(DOM.inputType).addEventListener('change',UICtrl.changedType);
    };

    var updateBudget = function() {

        budgetCtrl.calculateBudget();

        var budget = budgetCtrl.getBudget();

        UICtrl.displayBudget(budget);

    };

    var updatePercentages = function() {

        budgetCtrl.calculatePercentages();

        var percentages = budgetCtrl.getPercentage();

        UICtrl.displayPercentages(percentages);


    };


    var ctrlAddItem = function() {

        var input,newItem;

        // 1 : get data
        input = UICtrl.getInput();

        if(input.description !== "" && !isNaN(input.value) && input.value > 0)
        {
            // 2 : add to total
            newItem = budgetCtrl.addItem(input.type,input.description,input.value);
            // 3 : modify ui controller
            UICtrl.addListItem(newItem,input.type);
            UICtrl.clearFields();
            // 4 : cal budget
            updateBudget();

            updatePercentages();
        }

    };

    var ctrlDeleteItem = function(event) {

        var itemID,splitID,type,ID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if(itemID) {

            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            budgetCtrl.deleteItem(type,ID);
            UICtrl.deleteListItem(itemID);
            updateBudget();

            updatePercentages();
        }
    };

    return {

        init : function() {
            //console.log('sbdfvsgf');
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListener();
            UICtrl.displayMonth();
        }

    };



})(budgetController,UIController);

controller.init();