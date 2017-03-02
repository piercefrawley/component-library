import React, { PropTypes } from 'react';
import qs from 'qs';
import { get, patch } from './TatariApi';
import TatariDropdownPlain from './TatariDropdownPlain';
import TatariDropdownCheckboxes from './TatariDropdownCheckboxes';

import baseStyles from './Tatari.scss';
import defaultStyles from './TatariDefault.scss';
import composeStyles from '../../../shared/stylesheetComposer';

let styles = {};

export default class Tatari extends React.Component {
  static propTypes = {
    onComplete: PropTypes.func.isRequired,
    stylesheets: PropTypes.arrayOf(PropTypes.shape()),
    urls: PropTypes.shape({
      available: PropTypes.string.isRequired,
      patch: PropTypes.string,
      saved: PropTypes.string
    }).isRequired
  }

  static defaultProps = {
    stylesheets: [defaultStyles]
  }

  constructor(props) {
    super(props);

    styles = composeStyles(baseStyles, props.stylesheets);

    this.state = {
      activeFilters: [],
      expanded: {},
      inactiveFilters: [],
      hiding: {},
      loading: {},
      options: {}
    };
  }

  componentDidMount() {
    window.addEventListener('click', this.onBlur);

    Promise.all([
      get(this.props.urls.available),
      get(this.props.urls.saved)
    ])
    .then(([{ data: availableFilters }, { data: saved }]) => {
      const url = window.location.href.split('?');
      const params = qs.parse(url[1]);
      const previousFilters = params.filters || saved;

      const activeFilters = availableFilters.reduce((acc, filter, index) => {
        if (previousFilters[filter.key] !== undefined) {
          acc.push(Object.assign(filter, { index }));
        }

        return acc;
      }, []);

      const inactiveFilters = availableFilters.reduce((acc, filter, index) => {
        if (previousFilters[filter.key] === undefined) {
          acc.push(Object.assign(filter, { index }));
        }

        return acc;
      }, []);

      const loading = availableFilters.reduce((acc, filter) =>
        Object.assign(acc, { [filter.key]: previousFilters[filter.key] !== undefined }),
        {});

      this.setState({ inactiveFilters, activeFilters, loading });

      Promise.all(activeFilters.map(filter => get(filter.endpoint)))
        .then((values) => {
          const options = activeFilters.reduce((acc, filter, index) => {
            const { data } = values[index];

            const setChecked = d => Object.assign(d,
              { checked: (previousFilters[filter.key].indexOf(d.key.toString()) > -1) });

            return Object.assign(acc, { [filter.key]: data.map(setChecked) });
          }, {});

          this.setState({ options, loading: {} }, () => {
            this.updateUrl();
            this.props.onComplete();
          });
        });
    })
    .catch(e => { console.error(e); }) // eslint-disable-line
  }

  onExpand = (evt) => {
    evt.stopPropagation();
    const key = evt.currentTarget.dataset.key;
    if (this.state.loading[key]) {
      return;
    }

    const expandedStatus = !this.state.expanded[key];

    if (expandedStatus === false && key !== 'inactive') {
      this.onBlur();
    }

    const expanded = { [key]: expandedStatus };

    this.setState({ expanded });
  }

  onBlur = () => {
    const activeExpandedCount = this.state.activeFilters.reduce((acc, filter) =>
      (this.state.expanded[filter.key] === true ? acc + 1 : acc), 0);

    if (activeExpandedCount) {
      this.updateUrl();
      this.removeEmptyActive();
      this.saveOptions();
    }

    this.setState({ expanded: {} });
  }

  onSearch = (evt) => {
    evt.stopPropagation();

    const value = evt.target.value.toLowerCase();
    const key = evt.target.dataset.key;

    const options = this.state.options;

    const filteredOptions = options[key].map(option => Object.assign(option,
      { hidden: (option.value.toLowerCase().indexOf(value) === -1) }));

    options[key] = filteredOptions;

    this.setState({ options });
  }

  updateUrl = () => {
    const url = window.location.href.split('?');
    const params = qs.parse(url[1]);
    params.filters = this.createPayload();
    params.page = 1;

    const newParams = qs.stringify(params, { arrayFormat: 'brackets' });

    history.pushState(history.state, '', `${url[0]}?${newParams}`);
  };

  createPayload = () => {
    const { activeFilters, options } = this.state;

    const reduceSingle = (acc, value) => {
      if (value.key && value.checked === true) {
        acc.push(value.key);
      }

      return acc;
    };

    const reduceAll = (acc, filter) =>
      Object.assign(acc, { [filter.key]: options[filter.key].reduce(reduceSingle, []) });

    return activeFilters.reduce(reduceAll, {});
  }

  saveOptions = () => {
    const payload = { filters: this.createPayload() };

    Object.keys(payload.filters).length === 0
      ? patch(this.props.urls.patch, payload).then(this.props.onComplete)
      : this.props.onComplete();
  }

  checkOne = (evt) => {
    evt.stopPropagation();

    const { options } = this.state;
    const key = evt.currentTarget.dataset.key;
    const filterKey = evt.currentTarget.dataset.filterKey;

    options[filterKey] = options[filterKey].reduce((acc, option) => {
      option.key.toString() === key
        ? acc.push(Object.assign(option, { checked: !option.checked }))
        : acc.push(option);

      return acc;
    }, []);

    this.setState({
      options,
      expanded: Object.assign(this.state.expanded, { [filterKey]: true })
    });
  }

  checkAll = (evt) => {
    evt.stopPropagation();

    const key = evt.target.dataset.key;
    const { options } = this.state;

    options[key].reduce((acc, option) =>
      acc.concat(Object.assign(option, { checked: true })), []);

    this.setState({ options });
  }

  checkNone = (evt) => {
    evt.stopPropagation();

    const key = evt.target.dataset.key;
    const options = this.state.options;

    options[key].reduce((acc, option) =>
      Object.assign(option, { checked: false }), []);

    this.setState({ options });
  }

  addActive = (evt) => {
    evt.stopPropagation();

    const { activeFilters, inactiveFilters, loading, options } = this.state;

    const key = evt.target.dataset.key;
    const index = inactiveFilters.findIndex(filter => filter.key === key);
    const item = inactiveFilters[index];

    loading[key] = true;
    inactiveFilters.splice(index, 1);
    activeFilters.push(item);

    const retrieveOptions = () => {
      if (options[key] === undefined) {
        return get(item.endpoint);
      }

      return Promise.resolve({ data: options[key] });
    };

    retrieveOptions().then(({ data }) => {
      options[key] = data.map(d => Object.assign(d, { checked: false }));
      const newLoading = this.state.loading;
      newLoading[key] = false;

      const newExpanded = this.state.expanded;
      newExpanded[key] = true;

      this.setState({ options, loading: newLoading, expanded: newExpanded });
    });

    this.setState({ inactiveFilters, activeFilters, loading, expanded: {} });
  }

  removeActive = (evt) => {
    evt.stopPropagation();

    const { activeFilters, inactiveFilters } = this.state;
    const key = evt.target.dataset.key;

    const index = activeFilters.findIndex(filter => filter.key === key);
    const item = activeFilters[index];

    activeFilters.splice(index, 1);
    inactiveFilters.push(item);
    inactiveFilters.sort((a, b) => (a.index - b.index));

    this.setState({ inactiveFilters, activeFilters });
  }

  removeAllActive = () => {
    const { activeFilters, inactiveFilters } = this.state;
    const inactive = inactiveFilters.concat(activeFilters)
      .sort((a, b) => (a.index - b.index));

    this.setState({ inactiveFilters: inactive, activeFilters: [] }, this.updateUrl);
  }

  removeEmptyActive = () => {
    const { activeFilters, inactiveFilters } = this.state;

    const activeUpdated = activeFilters.reduce((activeAcc, filter) => {
      const isPopulated = this.state.options[filter.key]
        .reduce((acc, option) => acc || option.checked, false);

      if (isPopulated === false) {
        inactiveFilters.push(filter);
      } else {
        activeAcc.push(filter);
      }

      return activeAcc;
    }, []);

    inactiveFilters.sort((a, b) => (a.index - b.index));

    this.setState({
      activeFilters: activeUpdated,
      inactiveFilters
    });
  }

  render() {
    const inactiveFilters = this.state.inactiveFilters.length
      ? (<TatariDropdownPlain
        data={this.state.inactiveFilters}
        isExpanded={this.state.expanded.inactive}
        isLoading={this.state.loading.inactive}
        onChange={this.addActive}
        onExpand={this.onExpand}
        styles={styles}
      />)
      : null;

    const activeFilters = this.state.activeFilters
      .map(item => <TatariDropdownCheckboxes
        key={`active-${item.key}`}
        filter={item}
        isExpanded={this.state.expanded[item.key]}
        isHiding={this.state.hiding[item.key]}
        isLoading={this.state.loading[item.key]}
        onCheckOne={this.checkOne}
        onCheckAll={this.checkAll}
        onCheckNone={this.checkNone}
        onExpand={this.onExpand}
        onRemove={this.removeActive}
        onSearch={this.onSearch}
        options={this.state.options[item.key]}
        styles={styles}
      />);

    const clearAll = (activeFilters.length
      ? (<div
        onClick={this.removeAllActive}
        className={styles.clearAllFilters}
      >
        Clear All
      </div>)
      : null);

    return (
      <div className={styles.filterContainer}>
        {activeFilters}
        {inactiveFilters}
        {clearAll}
      </div>
    );
  }
}
