/***********************************************
* ng-d3 JavaScript Library
* Author: Jeffrey Ko
* License: MIT (http://www.opensource.org/licenses/mit-license.php)
* Compiled At: 04/28/2014 00:19
***********************************************/
(function(window, $) {
'use strict';
var ngD3Directives = angular.module('ngD3.directives', []);

angular.module('ngD3', ['ngD3.directives']);

if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
        if (typeof this !== "function") {
            // closest thing possible to the ECMAScript 5 internal IsCallable function
            throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
        }

        var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP = function () {},
            fBound = function () {
                return fToBind.apply(this instanceof fNOP && oThis ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();

        return fBound;
    };
}

var ngChart = function($scope, $element, options) {

    var self = this, defaults = {
        // ng-d3 properties
        chartType: null,
        data: [],

        // general chart properties
        color: [],
        margin: {},
        width: null,
        height: null,
        showLegend: true,
        noData: null,
        tooltips: true,
        tooltipContent: null,
        useInteractiveGuideline: false,
        transitionDuration: null,

        // x-axis
        showXAxis: true,
        xValue: null,
        xShowMaxMin: true,
        xAxisLabel: null,
        xAxisTickFormat: null,

        // x2-axis
        x2AxisLabel: null,
        x2AxisTickFormat: null,

        // y-axis
        showYAxis: true,
        yValue: null,
        yShowMaxMin: true,
        yAxisLabel: null,
        yAxisTickFormat: null,
        rightAlignYAxis: false, // lineChart

        // y1-axis
        y1AxisLabel: null,
        y1AxisTickFormat: null,

        // y2-axis
        y2AxisLabel: null,
        y2AxisTickFormat: null,

        // y3-axis
        y3AxisLabel: null,
        y3AxisTickFormat: null,

        // y4-axis
        y4AxisLabel: null,
        y4AxisTickFormat: null,
        
        // pie chart
        showLabels: true,
        labelThreshold: 0.5,
        labelType: 'key', // key, value or percent
        donut: false,
        donutRatio: 0,

        // discrete bar
        staggerLabels: false,
        showValues: false
    };

    self.data = [];
    
    self.config = $.extend(defaults, options);

    self.updateConfig = function (options) {
        self.config = $.extend(self.config, options);

        if (typeof self.config.data === "object") {
            self.data = self.config.data;
        }
    };
    
    self.setChartType = function (type) {
        if (typeof type !== 'string') return;
    
        self.model = nv.models[type];
    };
    
    self.configAxis = function (model) {

        if (typeof self.config.xValue === 'function')
            model.x(self.config.xValue);
        if (typeof self.config.yValue === 'function')
            model.y(self.config.yValue);

        if (model.xAxis && model.xAxis.showMaxMin)
            model.xAxis.showMaxMin(!!self.config.xShowMaxMin);
        if (model.yAxis && model.yAxis.showMaxMin)
            model.yAxis.showMaxMin(!!self.config.yShowMaxMin);

        var axes = [
            'xAxis',
            'x2Axis',
            'yAxis',
            'y1Axis',
            'y2Axis',
            'y3Axis',
            'y4Axis'
        ];

        angular.forEach(axes, function(e) {
            self.setAxisLabel(model, e);
            self.setTickFormat(model, e);
        });
    };
    
    self.setAxisLabel = function (model, axis) {
        var label = self.config[axis + 'Label'];
        if (model[axis] && model[axis].axisLabel && typeof label === 'string')
            model[axis].axisLabel(label);
    };
    
    self.setTickFormat = function (model, axis) {
        var tickFormat = self.config[axis + 'TickFormat'];
        if (model[axis] && model[axis].tickFormat && typeof tickFormat === 'string')
            model[axis].tickFormat(d3.format(tickFormat));
        else if (model[axis] && model[axis].tickFormat && typeof tickFormat === 'function')
            model[axis].tickFormat(tickFormat);
    };
    
    self.render = function () {
        
        self.setChartType(self.config.chartType);
        if (!self.model) return;
        var model = self.model();
        
        if (model.margin && self.config.margin !== null && typeof self.config.margin === 'object')
            model.margin(self.config.margin);
        if (model.color && $.isArray(self.config.color) && self.config.color.length)
            model.color(self.config.color);
        if (model.width && typeof self.config.width === 'number')
            model.width(self.config.width);
        if (model.height && typeof self.config.height === 'number')
            model.height(self.config.height);
        if (model.rightAlignYAxis)
            model.rightAlignYAxis(!!self.config.rightAlignYAxis);
        if (model.showLegend)
            model.showLegend(!!self.config.showLegend);
        if (typeof self.config.noData === 'string')
            model.noData(self.config.noData);
        if (model.useInteractiveGuideline)
            model.useInteractiveGuideline(!!self.config.useInteractiveGuideline);
        if (model.staggerLabels)
            model.staggerLabels(!!self.config.staggerLabels);
        if (model.tooltips)
            model.tooltips(!!self.config.tooltips);
        if (typeof self.config.tooltipContent === 'string')
            model.tooltipContent(self.config.tooltipContent);
        if (model.showValues)
            model.showValues(!!self.config.showValues);
        if (model.showLabels)
            model.showLabels(!!self.config.showLabels);
        if (model.labelThreshold)
            model.labelThreshold(self.config.labelThreshold);
        if (model.labelType)
            model.labelType(self.config.labelType);
        if (model.donut)
            model.donut(!!self.config.donut);
        if (model.donutRatio)
            model.donutRatio(self.config.donutRatio);
        
        self.configAxis(model);
            
        $element.empty();
        var svg = d3.select($element[0])
        .append('svg')
        .datum(self.data);
        
        if (typeof self.config.transitionDuration === 'number')
            svg = svg.transition().duration(self.config.transitionDuration);
        
        svg.call(model);

        nv.utils.windowResize(model.update);
    };
        
};
ngD3Directives
.directive('ngD3', ['$compile', function($compile) {
    var ngD3Directive = {
        scope: true,
        compile: function() {
            return {
                post: function($scope, iElement, iAttrs) {
                    var scope = $scope.$parent;
                    var $element = $(iElement);
                    var chart = new ngChart($scope, $element);
                    var watches = [];

                    $scope.$watch(iAttrs.ngD3, function(value) {
                        var options = scope.$eval(iAttrs.ngD3);
                        if (options) bindOptions(options);
                        else unbindOptions();
                    });

                    var bindOptions = function(options) {
                        options.$chartScope = $scope;
                        options.$chartScope.refresh = function () {
                            chart.updateConfig(options);
                            chart.render();
                        };

                        var chartTypeWatcher = function (newVal) {
                            if (chart.config.chartType === newVal) return;
                            options.$chartScope.refresh();
                        };
                        watches.push(scope.$watch(iAttrs.ngD3 + '.chartType', chartTypeWatcher));

                        // setup data watcher
                        if (typeof options.data === 'string') {
                            var dataWatcher = function (e) {
                                chart.data = e ? $.extend([], e) : [];
                                chart.render();
                                //iElement.empty().append(chart.render());
                            };
                            watches.push(scope.$watch(options.data, dataWatcher));
                            watches.push(scope.$watch(options.data + '.length', function() {
                                dataWatcher(scope.$eval(options.data));
                            }));
                        }
                    };

                    var unbindOptions = function() {
                        angular.forEach(watches, function(e) { e(); });
                        watches = [];
                        chart.data = [];
                        chart.render();
                    };


                }
            };

        }
    };

    return ngD3Directive;
}]);
}(window, jQuery));