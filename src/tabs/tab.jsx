let React = require('react');
let StylePropable = require('../mixins/style-propable');
let Colors = require('../styles/colors.js')


let Tab = React.createClass({

  mixins: [StylePropable],

  contextTypes: {
    muiTheme: React.PropTypes.object
  },

  propTypes: {
    handleTouchTap: React.PropTypes.func,
    selected: React.PropTypes.bool,
    width: React.PropTypes.string,
    touchTapOnForceActivate: React.PropTypes.bool,
    onForceActivate: React.PropTypes.bool,
  },

  handleTouchTap(forceActivate) {
    this.props.handleTouchTap(this.props.tabIndex, this, forceActivate);
  },

  componentDidUpdate() {
    if (this.props.didForceActivate) {
      if (this.props.onForceActivate && this.props.touchTapOnForceActivate) {
        console.error("[mui.Tab] Cannot set both onForceActivate and touchTapOnForceActivate, touchTapOnForceActivate takes precedence");
      }

      if (this.props.touchTapOnForceActivate) {
        this.handleTouchTap(true);
      }
      else if (this.props.onForceActivate) {
        this.onForceActivate();
      }
    }
  },

  render() {
    let styles = this.mergeAndPrefix({
      display: 'table-cell',
      cursor: 'pointer',
      textAlign: 'center',
      verticalAlign: 'middle',
      height: 48,
      color: Colors.white,
      opacity: 0.6,
      fontSize: 14,
      fontWeight: '500',
      whiteSpace: 'initial',
      fontFamily: this.context.muiTheme.contentFontFamily,
      boxSizing: 'border-box',
      width: this.props.width
    }, this.props.style);

    if (this.props.selected) styles.opacity = '1';

    return (
      <div style={styles} onTouchTap={this.handleTouchTap} routeName={this.props.route}>
        {this.props.label}
      </div>
    )
  }

});

module.exports = Tab;
