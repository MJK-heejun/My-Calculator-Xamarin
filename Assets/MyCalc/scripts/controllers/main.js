'use strict';

/**
 * @ngdoc function
 * @name testApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the testApp
 */
angular.module('myCalc')
  .controller('MainCtrl', function ($scope, snapRemote) {

    $scope.locked = true; //flag for lock/unlock
    $scope.form_data_array = []; //array for form_data
    $scope.form_data_array_index = 0; //array for form_data
    $scope.last_ans; //last answer value
    $scope.pretty_print = true; //pretty print by MathJax
    $scope.is_answer_displayed = false; //flag used when displaying answer
 
    var reset_flag = 0; //bug alert popup flag for the current version


    //snapjs setting
    $scope.snapOpts = {
      disable: 'right',
      touchToDrag: false
    };

    //girdsterjs setting
    $scope.gridsterOpts = {
      margins: [10, 10],
      columns: 5,
      outerMargin: false,
      swapping: true,
      pushing: true,
      floating: true,
      mobileBreakPoint: 330,
      draggable: {
        enabled: true,
        stop: function(event, $element, widget){
          $scope.selectGrid(widget);
        }
      },
      resizable: {
        enabled: false,
        handles: ['n', 'e', 's', 'w', 'se', 'sw']
      }
    };


    var default_items = [
      { 
        sizeX: 1,
        sizeY: 1,          
        name: "√",
        value: "sqrt(",
        position: [0, 0] },      
      { 
        sizeX: 1,
        sizeY: 1,          
        name: "!",
        value: "!",
        position: [0, 2]   },          
      { 
        sizeX: 1,
        sizeY: 1,          
        name: "^",
        value: "^"  },                  
      { 
        sizeX: 1,
        sizeY: 1,          
        name: "(",
        value: "("  },
      { 
        sizeX: 1,
        sizeY: 1,          
        name: ")",
        value: ")"  },          
      { 
        sizeX: 1,
        sizeY: 1,          
        name: "sin",
        value: "sin("  },          
      { 
        sizeX: 1,
        sizeY: 1,          
        name: "cos",
        value: "cos("  },          
      { 
        sizeX: 1,
        sizeY: 1,          
        name: "tan",
        value: "tan("  },          
      { 
        sizeX: 1,
        sizeY: 1,          
        name: "DEL",
        value: "del"  },
      { 
        sizeX: 1,
        sizeY: 1,          
        name: "AC",
        value: "ac"  },      
      { 
        sizeX: 1,
        sizeY: 1,          
        name: "7",
        value: "7"  },              
      { 
        sizeX: 1,
        sizeY: 1,          
        name: "8",
        value: "8"  },
      { 
        sizeX: 1,
        sizeY: 1,          
        name: "9",
        value: "9"  },        
      { 
        sizeX: 1,
        sizeY: 1,          
        name: "X",
        value: "*"  },        
      { 
        sizeX: 1,
        sizeY: 1,          
        name: "÷",
        value: "/"  },       
      { 
        sizeX: 1,
        sizeY: 1,          
        name: "4",
        value: "4"  },         
      { 
        sizeX: 1,
        sizeY: 1,          
        name: "5",
        value: "5"  },        
      { 
        sizeX: 1,
        sizeY: 1,          
        name: "6",
        value: "6"  },     
      { 
        sizeX: 1,
        sizeY: 1,          
        name: "+",
        value: "+"  },
      { 
        sizeX: 1,
        sizeY: 1,          
        name: "-",
        value: "-"  },                   
      { 
        sizeX: 1,
        sizeY: 1,          
        name: "1",
        value: "1"  },        
      { 
        sizeX: 1,
        sizeY: 1,          
        name: "2",
        value: "2"  },        
      { 
        sizeX: 1,
        sizeY: 1,          
        name: "3",
        value: "3"  },                                          
      { 
        sizeX: 1,
        sizeY: 1,         
        name: "ANS",
        value: "ans"  },  
      { 
        sizeX: 1,
        sizeY: 1,          
        name: "=",
        value: "="  },          
      { 
        sizeX: 1,
        sizeY: 1,          
        name: "0",
        value: "0"  },          
      { 
        sizeX: 1,
        sizeY: 1,          
        name: ".",
        value: "."  },                                        
      { 
        sizeX: 1,
        sizeY: 1,          
        name: "π",
        value: "pi"  }
    ];

    var default_additional_items = [ 
      { 
        sizeX: 1,
        sizeY: 1,          
        name: "abs",
        value: "abs("  }, 
      { 
        sizeX: 1,
        sizeY: 1,          
        name: "ceil",
        value: "ceil("  }, 
      { 
        sizeX: 1,
        sizeY: 1,          
        name: "floor",
        value: "floor("  },                   
      { 
        sizeX: 1,
        sizeY: 1,          
        name: "round",
        value: "round("  },                             
      { 
        sizeX: 1,
        sizeY: 1,          
        name: "log",
        value: "log10("  },      
      { 
        sizeX: 1,
        sizeY: 1,          
        name: "e",
        value: "e"  },      
      { 
        sizeX: 1,
        sizeY: 1,          
        name: "deg",
        value: "deg"  },      
      { 
        sizeX: 1,
        sizeY: 1,          
        name: ",",
        value: ","  }                        
    ];



    //initialize the current items that will be displayed
    $scope.current_items = [];
    $scope.current_additional_items = [];
    if(localStorage.getItem("saved_items") == null || localStorage.getItem("saved_additional_items") == null){
      $scope.current_items = default_items;
      $scope.current_additional_items = default_additional_items;
    }else{
      //$scope.current_items = default_items;
      $scope.current_items = angular.fromJson(localStorage.getItem("saved_items"));
      $scope.current_additional_items = angular.fromJson(localStorage.getItem("saved_additional_items"));
    }   

    //get the last answer from storage
    if(localStorage.getItem("last_ans") != null){
      $scope.last_ans = localStorage.getItem("last_ans");
    }


    //disable, able the grid
    $scope.$watch('locked', function(){      
      if($scope.locked){
        $scope.gridsterOpts.draggable.enabled = false;
        //$scope.gridsterOpts.resizable.enabled = false;
      }else{
        $scope.gridsterOpts.draggable.enabled = true;
        //$scope.gridsterOpts.resizable.enabled = true;
      }
    });

    //adding element to the main content 
    $scope.pushElement = function(index){
      var tmp = $scope.current_additional_items[index];
      //remove from current_additional_items list
      $scope.current_additional_items.splice(index,1);
      //add to current_items list
      $scope.current_items.push(tmp);
    };



    //grid click in Unlocked stage
    var tmp_col = -1;
    var tmp_row = -1;
    $scope.selectGrid = function(item){
      tmp_col = item.col;
      tmp_row = item.row;
    };
    //grid delete button action
    $scope.deleteSelected = function(){      
      if(tmp_col == -1 || tmp_row == -1){
        console.log("nothing selected");
      }else{
        for(var i=0; i<$scope.current_items.length; i++){
          if(tmp_col == $scope.current_items[i].col 
            && tmp_row == $scope.current_items[i].row){
            //add to the addition_items_list
            $scope.current_additional_items.push($scope.current_items[i]);
            //pop the element from the index
            $scope.current_items.splice(i,1);
            tmp_col = -1;
            tmp_row = -1;            
          }
        }
      }      
    };
    //ng-class for grid selection
    $scope.isGridSelected = function(item){
      if(item.col == tmp_col && item.row == tmp_row)
        return "grid-button-selected";
      else
        return "";
    };

    //the calculator button action - locked mode
    $scope.insertValue = function(value){

      if(typeof $scope.form_data == 'undefined')
        $scope.form_data = "";        

      //reset the form_data textbox after the answer
      if($scope.is_answer_displayed){
        $scope.form_data = ""; 
        $scope.form_data_array = [];        
        $scope.is_answer_displayed = false;
      }

      if(value == "="){
        try{
          $scope.last_ans = math.eval($scope.form_data);
          localStorage.setItem("last_ans", $scope.last_ans);
          console.log("answer: "+$scope.last_ans);

          $scope.is_answer_displayed = true;
        }catch(err){
          console.log(err);
        }        

        if($scope.pretty_print){
          //print by mathjax
          try{
            $scope.expression = "\\frac{5}{4} \\div \\frac{1}{6}";
            $scope.expression = math.parse($scope.form_data).toTex();
            $('#my_modal').modal('toggle');
          }catch(e){
            $scope.expression = "error";  
            $('#my_modal').modal('toggle');
          }

        }else{
          //print in the form data input field
          $scope.form_data = ""+$scope.last_ans;
        }

      }else if(value == "ac"){        
        $scope.form_data = ""; 
        $scope.form_data_array = [];
      }else if(value == "ans"){
        pushIntoFormDataArray($scope.last_ans);        
      }else if(value == "del"){
        deleteFromFormDataArray();
      }else{
        pushIntoFormDataArray(value);        
      }

      //caret setting
      $scope.caret.set = $scope.form_data.length;
    };


    //Buggy in the current version. Alert box tells the user about it
    $scope.resetAll = function(){
      if(reset_flag == 0){
        swal("Reset Successful", "You may now click on 'Save' to override the current setting", "success");
        $scope.current_items = default_items;   
        $scope.current_additional_items = default_additional_items;   
        reset_flag++;
      }else{
        swal("Reset Failed", "Sorry. The current version does not support 'Reset' button being clicked more than once in one session. Please refresh the page to enable it again.", "error");
      }

    };

    $scope.saveCurrent = function(){
      swal("Saved", "", "success");
      localStorage.setItem("saved_items", angular.toJson($scope.current_items));       
      localStorage.setItem("saved_additional_items", angular.toJson($scope.current_additional_items));       
    };


    $scope.infoPopUp = function(){
      swal("My Calculator V-1.0","Programmed and designed by MJK");
    };


    function deleteFromFormDataArray(){
      $scope.form_data_array.pop();
      $scope.form_data = $scope.form_data_array.join("");
    }

    function pushIntoFormDataArray(value){
      if($scope.form_data.length >= 0){
        $scope.form_data = $scope.form_data + value;
        $scope.form_data_array.push(value);
      }/*else if($scope.form_data.length > 0){
        $scope.form_data += value;
        $scope.form_data_array.push(value);
      }*/else{
        console.log("??? why < 0?: "+$scope.form_data.length);
      }
    }



  });
