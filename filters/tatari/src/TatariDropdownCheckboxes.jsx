import React, { PropTypes } from 'react';

export default class Tatari extends React.Component {
  static propTypes = {
    styles: PropTypes.shape()
  };

  static defaultProps = {
    styles: {}
  };

  constructor(props) {
    super(props);

    this.state = {
      expanded: false
    };
  }

  componentDidMount() {
    window.addEventListener('click', this.onBlur);
  }

  onBlur = () => {
    this.setState({ expanded: false });
  }

  render() {
    return <div className={styles.dropdownCheckboxes}>

    </div>;
  }
}
