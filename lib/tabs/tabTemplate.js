'use strict';

var React = require('react');
var StylePropable = require('../mixins/style-propable');

var TabTemplate = React.createClass({
  displayName: 'TabTemplate',

  mixins: [StylePropable],

  render: function render() {
    var styles = {
      'height': '0px',
      'overflow': 'hidden',
      'width': '100%',
      'position': 'relative',
      'textAlign': 'initial'
    };

    var flexFromProp = this.props.style;

    if (this.props.selected) {
      delete styles.height;
      delete styles.overflow;
    } else {
      flexFromProp = {};
    }

    return React.createElement(
      'div',
      { style: this.mergeAndPrefix(styles, flexFromProp) },
      this.props.children
    );
  }
});

module.exports = TabTemplate;