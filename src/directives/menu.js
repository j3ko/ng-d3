d3App
.directive('nvChartMenu', ['$window', function($window) {

    return {
        require: '^nvChart',
        scope: {},
        template:   '<ul class="nv-chart-menu" >' +
                        '<li ng-repeat="item in menuItems" ng-click="item.onClick(item)">' +
                            '<a>{{item.name}}</a>' +
                        '</li>' +
                    '</ul>',
        link: function($scope, elem, attrs, chartCtrl) {
            var $element = $(elem),
                menuOpened = false,
                w = angular.element($window),
                openTarget;

            $scope.menuItems = chartCtrl.menuItems;

            function closeMenu(element) {
                element.hide();
                menuOpened = false;
            }

            function openMenu(event, element) {
                element.css('position', 'absolute');
                element.css('top', Math.max(event.pageY, 0) + 'px');
                element.css('left', Math.max(event.pageX, 0) + 'px');
                element.show();
                menuOpened = true;
            }

            function onWindowClick(event) {
                if (menuOpened && (event.button !== 2 || event.target !== openTarget)){
                   closeMenu($element);
                }
            }

            $element.parent().bind('contextmenu', function(event) {
                event.preventDefault();
                event.stopPropagation();
                openTarget = event.target;

                openMenu(event, $element);
            });

            w.bind('keyup', function(event) {
                if (menuOpened && event.keyCode === 27) {
                    closeMenu($element);
                }
            });

            w.bind('click', onWindowClick);
            w.bind('contextmenu', onWindowClick);

        }
    };

}]);