<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <link rel="dns-prefetch" href="//cdnjs.gtimg.com">
    <link rel="dns-prefetch" href="//cdn.bootcss.com">
    <title>angularjs demo</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <!--360以极速模式(webkit)渲染-->
    <meta name="renderer" content="webkit">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="//cdn.bootcss.com/angular-material/1.1.5/angular-material.min.css" rel="stylesheet">
  </head>
  <body ng-controller="AppCtrl as app">
    <h1>angular.js </h1>
    <h2>{{ app.title }} {{ name }}</h2>
    <md-button class="md-raised md-primary" ng-click="app.onSay()">我是事件</md-button>
    <script src="//cdnjs.gtimg.com/cdnjs/libs/jquery/2.1.1-rc2/jquery.min.js"></script>
    <script src="//cdn.bootcss.com/angular.js/1.6.6/angular.min.js"></script>
    <script src="//cdn.bootcss.com/angular-ui-router/0.4.3/angular-ui-router.js"></script>
    <script src="//cdn.bootcss.com/angular.js/1.6.6/angular-animate.min.js"></script>
    <script src="//cdn.bootcss.com/angular.js/1.6.6/angular-aria.min.js"></script>
    <!-- <script src="//cdn.bootcss.com/angular.js/1.6.6/angular-cookies.min.js"></script> -->
    <!-- <script src="//cdn.bootcss.com/angular.js/1.6.6/angular-messages.min.js"></script> -->
    <script src="//cdn.bootcss.com/angular-material/1.1.5/angular-material.min.js"></script>
  </body>
</html>
