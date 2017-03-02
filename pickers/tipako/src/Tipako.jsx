import React, { PropTypes } from 'react';
import cx from 'classnames';
import baseStyles from './Tipako.scss';
import defaultStyles from './TipakoDefault.scss';
import composeStyles from '../../../shared/stylesheetComposer';

let timer = null;
let styles = {};
const tokensMemo = {};

export default class Tipako extends React.Component {
  static propTypes = {
    addGroupTokens: PropTypes.bool,
    data: PropTypes.arrayOf(PropTypes.shape({
      children: PropTypes.arrayOf(PropTypes.shape({
        text: PropTypes.string.isRequired
      })),
      text: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired
    })),
    groupIcon: PropTypes.string,
    itemIcon: PropTypes.string,
    maxResults: PropTypes.number,
    msgEmpty: PropTypes.string,
    msgPlaceholder: PropTypes.string,
    onFetch: PropTypes.func,
    onSelect: PropTypes.func.isRequired,
    renderTokens: PropTypes.func,
    stylesheets: PropTypes.arrayOf(PropTypes.shape())
  }

  static defaultProps = {
    addGroupTokens: false,
    data: [],
    groupIcon: null,
    itemIcon: null,
    maxResults: Math.Infinite,
    msgEmpty: 'No matching items.',
    msgPlaceholder: 'Search...',
    onFetch: null,
    renderTokens: null,
    stylesheets: [defaultStyles]
  }

  constructor(props) {
    super(props);

    styles = composeStyles(baseStyles, props.stylesheets);

    this.state = {
      data: this.props.data || [],
      expanded: false,
      fetching: false,
      tokens: [],
      value: ''
    };
  }

  componentWillMount() {
    window.addEventListener('click', this.onBlur);
  }

  componentDidMount() {
    if (this.props.onFetch !== Tipako.defaultProps.onFetch) {
      this.props.onFetch('', (data) => {
        this.setState({ data, fetching: false });
      });
    }
  }

  onSearch = (evt) => {
    const str = evt.target.value;

    if (this.props.onFetch === Tipako.defaultProps.onFetch) {
      const data = this.props.data.reduce((acc, val) => {
        const matchText = val.text.toLowerCase().indexOf(str) !== -1;

        const matchChild = val.children &&
          val.children.reduce((result, child) =>
            result || (child.text.toLowerCase().indexOf(str) !== -1), false);

        if (matchText || matchChild) {
          return acc.concat(val);
        }

        return acc;
      }, []);

      this.setState({ data, expanded: true });
    } else {
      this.setState({ value: str, fetching: true });
      clearTimeout(timer);

      timer = setTimeout(() => {
        this.props.onFetch(str, (data) => {
          this.setState({ data, expanded: true, fetching: false });
        });
      }, 500);
    }

    this.setState({ value: str });
  }

  onChildClick = (child) => {
    if (child.disabled) {
      return;
    }

    const tokens = this.state.tokens;

    tokensMemo[child.id] = tokens.length;
    tokens.push(child);

    this.setState({ tokens, data: this.props.data, expanded: false, value: '' });
  }

  onGroupClick = (group) => {
    if (group.disabled) {
      return;
    }

    const tokens = this.state.tokens;

    // Use child index stored in the memoisation to remove if exists. Ben 170222
    group.children.forEach((child) => {
      if (tokensMemo[child.id] !== undefined) {
        tokens.splice(tokensMemo[child.id], 1);
        delete tokensMemo[child.id];
      }
    });

    if (this.props.addGroupTokens) {
      tokensMemo[group.id] = tokens.length;
      tokens.push(group);
    }

    group.children.forEach((child) => {
      tokensMemo[child.id] = tokens.length;
      tokens.push(child);
    });

    this.props.onSelect(tokens);
    this.setState({ tokens, expanded: false, value: '' });
  }

  onUngroupedClick = (ungrouped) => {
    if (ungrouped.disabled) {
      return;
    }

    const tokens = this.state.tokens;
    tokensMemo[ungrouped.id] = tokens.length;
    tokens.push(ungrouped);

    this.props.onSelect(tokens);
    this.setState({ tokens, expanded: false, value: '' });
  }

  onTokenClick = (obj) => {
    const tokens = this.state.tokens;
    tokens.splice(tokensMemo[obj.id], 1);
    delete tokensMemo[obj.id];

    tokens.forEach((t, i) => {
      tokensMemo[t.id] = i;
    });

    this.props.onSelect(Object.values(tokens));
    this.setState({ tokens, expanded: false });
  }

  onCaretClick = (evt) => {
    evt.stopPropagation();
    this.setState({ expanded: true });
  }

  onSelectAll = () => {
    const { addGroupTokens } = this.props;

    const tokens = this.state.data.reduce((acc, obj) => {
      const result = acc;

      if (obj.children) {
        if (addGroupTokens) {
          tokensMemo[obj.id] = result.length;
          result.push(obj);
        }

        obj.children.forEach((child) => {
          tokensMemo[child.id] = result.length;
          result.push(child);
        });
      } else {
        tokensMemo[obj.id] = result.length;
        result.push(obj);
      }

      return result;
    }, []);

    this.props.onSelect(Object.values(tokens));
    this.setState({ tokens, expanded: false });
  }

  onClearAll = () => {
    this.props.onSelect([]);
    this.setState({ tokens: [], expanded: false });
  }

  onBlur = () => {
    this.setState({ expanded: false });
  };

  render() {
    const itemIcon = this.props.itemIcon
      ? <img alt='Item' src={this.props.itemIcon} className={styles.itemIcon} />
      : null;

    const groupIcon = this.props.groupIcon
      ? <img alt='Group' src={this.props.groupIcon} className={styles.itemIcon} />
      : null;

    const items = this.state.data.reduce((acc, v) => {
      // Grouped
      if (v.children) {
        const children = v.children.reduce((result, vv) => {
          if (tokensMemo[vv.id] !== undefined) {
            return result;
          }

          return result.concat(<button
            onClick={() => { this.onChildClick(vv); }}
            className={cx(styles.item, styles.childItem, { [styles.disabled]: vv.disabled })}
            key={`item-${vv.id}`}
          >
            {itemIcon}
            {vv.text}
          </button>);
        }, []);

        if (this.props.addGroupTokens === false && children.length === 0) {
          return acc;
        }

        if (tokensMemo[v.id] !== undefined && children.length === 0) {
          return acc;
        }

        const group = (<button
          onClick={() => { this.onGroupClick(v); }}
          className={cx(styles.item, styles.groupItem, { [styles.disabled]: v.disabled })}
          key={`item-${v.id}`}
        >
          {groupIcon}
          {v.text}
        </button>);

        return acc.concat(group).concat(children);
      }

      // Ungrouped
      if (tokensMemo[v.id] !== undefined) {
        return acc;
      }

      const ungrouped = (<button
        onClick={() => { this.onUngroupedClick(v); }}
        className={cx(styles.item, styles.ungroupedItem, { [styles.disabled]: v.disabled })}
        key={`item-${v.id}`}
      >
        {itemIcon}
        {v.text}
      </button>);

      return acc.concat(ungrouped);
    }, []);

    const selectall = (<div className={styles.controls}>
      <button
        className={styles.controlsButton}
        onClick={this.onSelectAll}
      >
         Select All
      </button>
      <div className={styles.controlsSpacer}>/</div>
      <button
        className={styles.controlsButton}
        onClick={this.onClearAll}
      >
        Clear All
      </button>
    </div>);

    const tokens = this.props.renderTokens
       ? this.props.renderTokens(this.state.tokens, this.onTokenClick)
       : this.state.tokens.map(val => (<button
         className={styles.token}
         key={`token-${val.id}`}
         onClick={() => { this.onTokenClick(val); }}
       >
         {val.text}
       </button>));

    const nomatch = <div className={styles.nomatch}>{this.props.msgEmpty}</div>;

    const caret = (this.state.fetching || items.length === 0)
      ? null
      : (<button onClick={this.onCaretClick} className={styles.caret}>
        <span className={cx('fa', 'fa-caret-down', styles.arrow, { [styles.expanded]: this.state.expanded })} />
      </button>);

    const busy = this.state.fetching
      ? <span className={styles.busy} />
      : null;

    const maxResultsWarningIcon =
      (this.state.fetching || this.state.data.length < this.props.maxResults)
      ? null
      : <span className={`fa fa-exclamation-triangle ${styles.maxResults}`} />;

    const maxResultsWarningText =
      (this.state.fetching || items.length < this.props.maxResults)
      ? ''
      : 'This search is too general, so the results have been limited.';

    return (<div
      className={styles.picker}
      title={maxResultsWarningText}
    >
      {tokens}

      <div className={cx(styles.inputContainer)}>
        <input
          className={styles.input}
          type='text'
          placeholder={this.props.msgPlaceholder}
          value={this.state.value}
          onChange={this.onSearch}
        />
        {caret}
        {busy}
        {maxResultsWarningIcon}
      </div>

      <div className={styles.dropdownContainer}>
        <div
          className={cx(styles.dropdown, {
            [styles.expanded]: this.state.expanded })}
        >
          {items.length > 0 ? selectall : ''}
          {items.length ? items : nomatch}
        </div>
      </div>
    </div>);
  }
}
