'use strict';

var React = require('react/addons');
var TabTemplate = require('./tabTemplate');
var InkBar = require('../ink-bar');
var StylePropable = require('../mixins/style-propable');
var Events = require('../utils/events');

var Tabs = React.createClass({
  displayName: 'Tabs',

  mixins: [StylePropable],

  contextTypes: {
    muiTheme: React.PropTypes.object
  },

  propTypes: {
    initialSelectedIndex: React.PropTypes.number,
    onActive: React.PropTypes.func,
    tabWidth: React.PropTypes.number,
    tabItemContainerStyle: React.PropTypes.object,
    contentContainerStyle: React.PropTypes.object,
    flexContent: React.PropTypes.bool
  },

  getInitialState: function getInitialState() {
    var selectedIndex = 0;
    if (this.props.initialSelectedIndex && this.props.initialSelectedIndex < this.props.children.length) {
      selectedIndex = this.props.initialSelectedIndex;
    }
    return {
      selectedIndex: selectedIndex,
      forceActivate: true,
      previousKey: undefined
    };
  },

  getEvenWidth: function getEvenWidth() {
    return parseInt(window.getComputedStyle(React.findDOMNode(this)).getPropertyValue('width'), 10);
  },

  componentDidMount: function componentDidMount() {
    this._updateTabWidth();
    Events.on(window, 'resize', this._updateTabWidth);
  },

  componentWillUnmount: function componentWillUnmount() {
    Events.off(window, 'resize', this._updateTabWidth);
  },

  componentDidUpdate: function componentDidUpdate() {},

  componentWillReceiveProps: function componentWillReceiveProps(newProps) {
    if (newProps.hasOwnProperty('style')) this._updateTabWidth();

    if (newProps.children.length === 0) {
      this.setState({ selectedIndex: 0, previousKey: undefined, forceActivate: false });
    } else if (this.state.selectedIndex >= newProps.children.length) {
      var selectedIndex = newProps.children.length - 1;
      var forceActivate = true;
      var previousKey = newProps.children[selectedIndex].key;
      this.setState({ selectedIndex: selectedIndex, forceActivate: forceActivate, previousKey: previousKey });
    } else if (this.state.previousKey !== newProps.children[this.state.selectedIndex].key) {
      var forceActivate = true;
      var previousKey = newProps.children[this.state.selectedIndex].key;
      this.setState({ forceActivate: forceActivate, previousKey: previousKey });
    } else {
      var forceActivate = false;
      //let previousKey = this.props.children[this.state.selectedIndex].key;
      this.setState({ forceActivate: forceActivate });
    }
  },

  handleTouchTap: function handleTouchTap(tabIndex, tab, forceActivate) {
    if (this.props.onChange && this.state.selectedIndex !== tabIndex) {
      this.props.onChange(tabIndex, tab);
    }

    if (forceActivate !== true) {
      this.setState({ selectedIndex: tabIndex });
    }

    //default CB is _onActive. Can be updated in tab.jsx
    if (tab.props.onActive) tab.props.onActive(tab);
  },

  getStyles: function getStyles() {
    var themeVariables = this.context.muiTheme.component.tabs;
    var flexContent = this.props.flexContent;

    var flexStyle = {
      display: 'flex',
      flex: '1',
      flexDirection: 'column'
    };

    return {
      tabItemContainer: {
        margin: '0',
        padding: '0',
        width: '100%',
        height: '48px',
        backgroundColor: themeVariables.backgroundColor,
        whiteSpace: 'nowrap',
        display: 'table'
      },
      flexStyle: flexContent ? flexStyle : {}
    };
  },

  render: function render() {
    var _this = this;

    var styles = this.getStyles();

    var tabContent = [];
    var width = this.state.fixedWidth ? 100 / this.props.children.length + '%' : this.props.tabWidth + 'px';

    var left = 'calc(' + width + '*' + this.state.selectedIndex + ')';

    var tabs = React.Children.map(this.props.children, function (tab, index) {
      if (tab.type.displayName === 'Tab') {
        if (tab.props.children) {
          tabContent.push(React.createElement(TabTemplate, {
            key: tab.key,
            selected: _this.state.selectedIndex === index,
            style: _this.mergeAndPrefix(styles.flexStyle)
          }, tab.props.children));
        } else {
          tabContent.push(undefined);
        }

        var clone = React.cloneElement(tab, {
          reactKey: tab.key,
          selected: _this.state.selectedIndex === index,
          tabIndex: index,
          width: width,
          handleTouchTap: _this.handleTouchTap,
          didForceActivate: _this.state.forceActivate && index === _this.state.selectedIndex
        });
        return clone;
      } else {
        var type = tab.type.displayName || tab.type;
        throw 'Tabs only accepts Tab Components as children. Found ' + type + ' as child number ' + (index + 1) + ' of Tabs';
      }
    }, this);

    return React.createElement(
      'div',
      { style: this.mergeAndPrefix(styles.flexStyle, this.props.style) },
      React.createElement(
        'div',
        { style: this.mergeAndPrefix(styles.tabItemContainer, this.props.tabItemContainerStyle) },
        tabs
      ),
      React.createElement(InkBar, { left: left, width: width }),
      React.createElement(
        'div',
        { style: this.mergeAndPrefix(styles.flexStyle, this.props.contentContainerStyle) },
        tabContent
      )
    );
  },

  _tabWidthPropIsValid: function _tabWidthPropIsValid() {
    return this.props.tabWidth && this.props.tabWidth * this.props.children.length <= this.getEvenWidth();
  },

  // Validates that the tabWidth can fit all tabs on the tab bar. If not, the
  // tabWidth is recalculated and fixed.
  _updateTabWidth: function _updateTabWidth() {
    if (this._tabWidthPropIsValid()) {
      this.setState({
        fixedWidth: false
      });
    } else {
      this.setState({
        fixedWidth: true
      });
    }
  }

});

module.exports = Tabs;