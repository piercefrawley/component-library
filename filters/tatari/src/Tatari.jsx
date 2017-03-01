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
      const activeFilters = availableFilters.reduce((acc, filter, index) => {
        if (saved[filter.key] !== undefined) {
          acc.push(Object.assign(filter, { index }));
        }

        return acc;
      }, []);

      const inactiveFilters = availableFilters.reduce((acc, filter, index) => {
        if (saved[filter.key] === undefined) {
          acc.push(Object.assign(filter, { index }));
        }

        return acc;
      }, []);

      const loading = availableFilters.reduce((acc, filter) =>
        Object.assign(acc, { [filter.key]: saved[filter.key] !== undefined }),
        {});

      this.setState({ inactiveFilters, activeFilters, loading });

      Promise.all(activeFilters.map(filter => get(filter.endpoint)))
        .then((values) => {
          const options = activeFilters.reduce((acc, filter, index) => {
            const { data } = values[index];

            const setChecked = d =>
              Object.assign(d, { checked: (saved[filter.key].indexOf(d.key) > -1) });

            return Object.assign(acc, { [filter.key]: data.map(setChecked) });
          }, {});

          this.setState({ options, loading: {} });
        });
    })
    .catch(e => { console.error(e); }) // eslint-disable-line

        // Populate filters from URL first, then try remote retrieve.
        // const url = window.location.href.split('?');
        // const params = qs.parse(url[1]);
        // if (params.filters) {
        //   // TODO is this correct
        //   return { data: params.filters };
        // }
  }

  onExpand = (evt) => {
    evt.stopPropagation();
    const key = evt.currentTarget.dataset.key;
    if (this.state.loading[key]) {
      return;
    }


    const expandedStatus = !this.state.expanded[key];

    if (expandedStatus === false && key !== 'inactive') {
      this.saveOptions();
    }

    const expanded = { [key]: expandedStatus };

    this.setState({ expanded });
  }

  onBlur = () => {
    // TODO this.removeEmptyActive();
    this.setState({ expanded: {} });
  }

  onSearch = (evt) => {
    const value = evt.target.value.toLowerCase();
    const key = evt.target.dataset.key;

    const options = this.state.options;

    const filteredOptions = options[key].map(option => Object.assign(option,
      { hidden: (option.value.toLowerCase().indexOf(value) === -1) }));

    options[key] = filteredOptions;

    this.setState({ options });
  }

  saveOptions = () => {
    const { options } = this.state;

    const reduceSingle = (acc, value) => {
      if (value.key && value.checked === true) {
        acc.push(value.key);
      }

      return acc;
    };

    const reduceAll = (acc, key) =>
      Object.assign(acc, { [key]: options[key].reduce(reduceSingle, []) });

    const payload = { filters: Object.keys(options).reduce(reduceAll, {}) };

    if (Object.keys(payload.filters).length === 0) {
      return;
    }

    patch(this.props.urls.patch, payload).then(this.props.onComplete);
  }

  checkOne = (evt) => {
    evt.stopPropagation();

    const { options } = this.state;
    const key = evt.target.dataset.key;
    const filterKey = evt.target.dataset.filterKey;

    options[filterKey].forEach((option) => {
      if (option.key.toString() === key) {
        option.checked = !option.checked;
      }
    });

    this.setState({ options, expanded: Object.assign(this.state.expanded, { [filterKey]: true }) });
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

  animateRemove = (evt) => {
    evt.stopPropagation();
    const key = evt.target.dataset.key;
    const hiding = Object.assign(this.state.hiding, { [key]: true });

    const animationFinished = () => {
      this.removeActive(key);
    };

    this.setState({ hiding }, setTimeout.bind(null, animationFinished, 300));
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

    const animationFinished = () => {
      const hiding = Object.assign(this.state.hiding, { [key]: false });
      this.setState({ hiding });
    };

    retrieveOptions().then(({ data }) => {
      options[key] = data.map(d => Object.assign(d, { checked: false }));
      const newLoading = this.state.loading;
      newLoading[key] = false;
      this.setState({ options, loading: newLoading });
    });

    this.setState({ inactiveFilters, activeFilters, loading, expanded: {} }, setTimeout.bind(null, animationFinished, 300));
  }

  removeActive = (key) => {
    const { activeFilters, inactiveFilters } = this.state;
    const hiding = Object.assign(this.state.hiding, { [key]: true });

    const index = activeFilters.findIndex(filter => filter.key === key);
    const item = activeFilters[index];

    activeFilters.splice(index, 1);
    inactiveFilters.push(item);
    inactiveFilters.sort((a, b) => (a.index - b.index));

    this.setState({ inactiveFilters, activeFilters, hiding });
  }

  removeAllActive = () => {
    // TODO URL update
    const { activeFilters, inactiveFilters } = this.state;
    const inactive = inactiveFilters.concat(activeFilters)
      .sort((a, b) => (a.index - b.index));

    this.setState({ inactiveFilters: inactive, activeFilters: [] });
  }

  removeEmptyActive = () => {
    // const { activeFilters, inactiveFilters } = this.state;
    //
    // const activeUpdated = activeFilters.reduce((activeAcc, filter) => {
    //   const isPopulated = this.state.options[filter.key]
    //     .reduce((acc, option) => acc || option.checked, false);
    //
    //   if (isPopulated === false) {
    //     this.state.options[filter.key].forEach((option) => { option.checked = false; });
    //     inactiveFilters.push(filter);
    //   } else {
    //     activeAcc.push(filter);
    //   }
    //
    //   return activeAcc;
    // }, []);
    //
    // inactiveFilters.sort((a, b) => (a.index - b.index));
    //
    // this.setState({
    //   activeFilters: activeUpdated,
    //   inactiveFilters
    // });
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
        onRemove={this.animateRemove}
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
