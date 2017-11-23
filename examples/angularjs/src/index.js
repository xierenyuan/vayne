import './index.scss'
import tpl from './demo.html'
import angular from 'angular'
import ngMaterial from 'angular-material'
console.log(tpl)
class AppCtrl {
  constructor($scope, $mdToast) {
    'ngInject'
    this.$$mdToast = $mdToast
    this.title = 'hello'
    $scope.name = 'word'
  }

  onSay() {
    this.$$mdToast.show(
      this.$$mdToast.simple().position('top').textContent('Hello!')
    )
  }
}

angular.module('rrc.demo.app', [ngMaterial]).controller('AppCtrl', AppCtrl)

const doc = document
angular.element(doc).ready(function () {
  angular.bootstrap(doc, ['rrc.demo.app'])
})
