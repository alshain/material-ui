let React = require('react');
let StylePropable = require('../mixins/style-propable');


let TabTemplate = React.createClass({

  mixins: [StylePropable],

  render() {
    let styles = {
      'height': '0px',
      'overflow': 'hidden',
      'width': '100%',
      'position': 'relative',
      'textAlign': 'initial'
    };

    let flexFromProp = this.props.style;

    if (this.props.selected) {
      delete styles.height;
      delete styles.overflow;
    }
    else {
      flexFromProp = {};
    }

    return (
      <div style={this.mergeAndPrefix(styles, flexFromProp)}>
        {this.props.children}
      </div>
    );
  }
});

module.exports = TabTemplate;
